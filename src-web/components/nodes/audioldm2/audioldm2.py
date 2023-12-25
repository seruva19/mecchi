import uuid
from flask import Flask, request
from diffusers import AudioLDM2Pipeline
import torch
import scipy


def plugin():
    return AudioLdm2Plugin


class AudioLdm2Plugin:
    def __init__(self):
        self.ldm2pipe = None

    def load(self, app: Flask, mecchi_utils):
        @app.route("/mecchi/audioldm2", methods=["POST"])
        def audioldm2_inference():
            params = request.get_json()
            print(f"running audioldm2 inference with params {params}")

            if (
                not mecchi_utils.is_model_registered("audioldm2:diffusers")
                or self.ldm2pipe is None
            ):
                repo_id = "cvssp/audioldm2"
                self.ldm2pipe = AudioLDM2Pipeline.from_pretrained(
                    repo_id, torch_dtype=torch.float16
                )
                self.ldm2pipe = self.ldm2pipe.to("cuda")

                mecchi_utils.register_model("audioldm2:diffusers", self.ldm2pipe)

            prompt = params.get("prompt")
            steps = params.get("steps")
            length = params.get("length")
            scale = params.get("scale")
            negative_prompt = params.get("negative_prompt")

            pipe: AudioLDM2Pipeline = self.ldm2pipe  # type: ignore

            files = []
            audio = pipe(
                prompt=prompt,
                num_inference_steps=int(steps),
                audio_length_in_s=float(length),
                guidance_scale=float(scale),
                negative_prompt=negative_prompt,
                return_dict=True,
            )[
                "audios"
            ][  # type: ignore
                0
            ]

            filename = f"{uuid.uuid4()}.wav"
            scipy.io.wavfile.write(f"out_data/{filename}", rate=16000, data=audio)
            files.append(filename)

            return {"samples": files}
