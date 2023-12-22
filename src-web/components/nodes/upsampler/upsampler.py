import sys
from flask import Flask, request
import os
import random
from huggingface_hub import hf_hub_download
import numpy as np
import soundfile as sf
import torch
from cog import BasePredictor, Input, Path
from typing import Any

from audiosr import build_model, super_resolution
from audiosr import utils


def plugin():
    return AudioSrPlugin


class AudioSrPlugin:
    def __init__(self):
        os.environ["TOKENIZERS_PARALLELISM"] = "true"
        torch.set_float32_matmul_precision("high")
        self.model_name = "basic"
        self.audiosr = None

    def load(self, app: Flask, mecchi_utils):
        @app.route("/mecchi/audiosr", methods=["POST"])
        def audiosr_inference():
            params = request.get_json()
            print(f"running audiosr with params {params}")

            sample = params.get("sample")
            ddim_steps = int(params.get("steps"))
            seed = int(params.get("seed"))
            guidance_scale = float(params.get("guidance"))

            device = "cuda"  # TODO: should be passed in params
            samplerate = 48000

            if (
                not mecchi_utils.is_model_registered("audiosr")
                or self.audiosr is None
                or self.model_name != "basic"
            ):
                self.model_name = "basic"
                self.audiosr = build_model(model_name=self.model_name, device=device)

                mecchi_utils.register_model("audiosr", self.audiosr)

            if seed == -1:
                seed = random.randint(0, 2**32 - 1)
                print(f"Setting seed to: {seed}")

            input_file = f"out_data/{sample}"
            waveform: Any = super_resolution(
                self.audiosr,
                input_file,
                seed=int(seed),
                ddim_steps=int(ddim_steps),
                guidance_scale=float(guidance_scale),
                latent_t_per_second=12.8,
            )

            name, _ = os.path.splitext(sample)

            files = []
            out_wav = (waveform[0] * 32767).astype(np.int16).T
            out_file = f"upsampled_{name}.wav"
            out_path = f"out_data/{out_file}"
            sf.write(
                out_path,
                data=out_wav,
                samplerate=samplerate,
            )
            files.append(out_file)

            return {"samples": files}
