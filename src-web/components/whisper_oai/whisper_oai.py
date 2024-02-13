import os
import uuid
from flask import Flask, request
import whisper


def plugin():
    return WhisperPlugin


class WhisperPlugin:
    def __init__(self):
        self.model = None

    def load(self, app: Flask, mecchi_utils):
        @app.route("/mecchi/whisper", methods=["POST"])
        def whisper_inference():
            params = request.get_json()
            print(f"running openai whisper with params {params}")

            sample = params.get("sample")
            device = params.get("device")
            threshold = params.get("threshold")

            if self.model is None:
                self.model = whisper.load_model(
                    name="base", device=device, download_root="cache"
                )
                mecchi_utils.register_model("whisper", self.model)

            input_file = f"out_data/{sample}"
            result = self.model.transcribe(
                audio=input_file, compression_ratio_threshold=threshold
            )
            text = result["text"]

            return {"text": text}
