import os
from flask import Flask, request
import librosa
import torch
import torchaudio
from transformers import ClapProcessor, ClapModel
import json


def plugin():
    return ClapInterrogatorPlugin


class ClapInterrogatorPlugin:
    def __init__(self):
        self.processor: ClapProcessor | None = None
        self.model: ClapModel | None = None
        self.tags_source = []

    def create_tags_list_from_file(self, file_path):
        with open(file_path, "r") as file:
            data = json.load(file)
            tags = data.get("tags", [])
        unique_tags = list(set(tags))
        return unique_tags

    def infer_tags(self, audio_input, device, sampling_rate, top_n):
        audio, _ = librosa.load(audio_input, sr=sampling_rate)
        audio_tensor = torch.tensor(audio, device=device)

        inputs = self.processor(text=self.tags_source, audios=[audio], sampling_rate=sampling_rate, return_tensors="pt", padding=True)  # type: ignore
        inputs = {key: val.to(device) for key, val in inputs.items()}

        with torch.no_grad():
            outputs = self.model(**inputs)  # type: ignore
        probs = outputs.logits_per_audio.softmax(dim=-1)
        _, top_indices = probs.topk(top_n, dim=1)
        top_matches = [self.tags_source[i] for i in top_indices[0].tolist()]
        return top_matches

    def load(self, app: Flask, mecchi_utils):
        @app.route("/mecchi/clap_interrogator", methods=["POST"])
        def clap_interrogate():
            params = request.get_json()
            print(f"running CLAP interrogation with params {params}")

            device = params.get("device")
            checkpoint = params.get("checkpoint")
            tags_path = params.get("tagsFile")
            num_tags = params.get("tagsCount")
            sample = params.get("sample")

            if self.model is None:
                self.processor = ClapProcessor.from_pretrained(checkpoint)
                self.model = ClapModel.from_pretrained(checkpoint)  # type: ignore

                device = torch.device(device)
                self.model.to(device)  # type: ignore

            current_dir = os.path.dirname(os.path.abspath(__file__))
            self.tags_source = self.create_tags_list_from_file(
                file_path=os.path.join(current_dir, tags_path)
            )

            samples_dir = os.getenv("OUT_DATA", default="out_data")
            sample_path = os.path.join(samples_dir, sample)
            sr = 48000
            top_tags = self.infer_tags(sample_path, device, sr, int(num_tags))
            return {"tags": top_tags}
