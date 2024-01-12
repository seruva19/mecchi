import os
import uuid
from flask import Flask, request
from transformers import AutoProcessor, BarkModel
import torch
import scipy


def plugin():
    return BarkPlugin


class BarkPlugin:
    def __init__(self):
        self.processor: AutoProcessor
        self.model_type = "suno/bark"
        self.model: BarkModel

    def load(self, app: Flask, mecchi_utils):
        @app.route("/mecchi/bark", methods=["POST"])
        def bark_inference():
            # os.environ["SUNO_OFFLOAD_CPU"] = "True"
            # os.environ["SUNO_USE_SMALL_MODELS"] = "True"

            params = request.get_json()

            device = params.get("device")
            prompt = params.get("prompt")
            model_type = params.get("model")
            voice_preset = params.get("preset")

            print(f"running bark inference with params {params}")

            if (
                not mecchi_utils.is_model_registered("bark:transformers")
                or self.processor is None
                or self.model is None
                or self.model_type != model_type
            ):
                self.processor = AutoProcessor.from_pretrained(model_type)
                self.model = BarkModel.from_pretrained(model_type)  # type: ignore

                self.model.to(device)  # type: ignore
                mecchi_utils.register_model("bark:model:transformers", self.model)

            inputs = self.processor(prompt, voice_preset=voice_preset).to(device)  # type: ignore

            audio_array = self.model.generate(**inputs)  # type: ignore
            audio_array = audio_array.cpu().numpy().squeeze()

            sample_rate = self.model.generation_config.sample_rate  # type: ignore

            files = []
            filename = f"{uuid.uuid4()}.wav"

            if not os.path.exists("out_data"):
                os.makedirs("out_data")

            scipy.io.wavfile.write(
                f"out_data/{filename}", rate=sample_rate, data=audio_array
            )
            files.append(filename)
            return {"samples": files}
