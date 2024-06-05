import os
from typing import Any

import numpy as np
import torch
import torchaudio
from einops import rearrange
from stable_audio_tools import get_pretrained_model
from stable_audio_tools.inference.generation import generate_diffusion_cond

from hf_tools import get_preloaded_model
from flask import Flask, request
import uuid


def plugin():
    return StableAudioOpenPlugin


class StableAudioOpenPlugin:
    def __init__(self):
        self.model = None
        self.model_config = None

    def load(self, app: Flask, mecchi_utils):
        @app.route("/mecchi/sa-open10", methods=["POST"])
        def sa_open10_inference():
            params = request.get_json()
            device = params.get("device")

            print_params = params.copy()
            print_params["token"] = "***"
            print_params["device"] = device
            print(
                f"running stable-audio-open (1.0) inference with params {print_params}"
            )

            if self.model is None:
                token = params.get("token")
                if token is None:  # assuming user downlaoded model from other place
                    model, model_config = get_preloaded_model(
                        "cache", "stable-audio-open-1.0"
                    )
                else:
                    os.environ["HF_TOKEN"] = token
                    model, model_config = get_pretrained_model(
                        "stabilityai/stable-audio-open-1.0"
                    )

                self.model = model.to(device)
                self.model_config = model_config

                mecchi_utils.register_model("stable-audio-open-1.0", self.model)

            sample_rate = self.model_config["sample_rate"]  # type: ignore
            sample_size = self.model_config["sample_size"]  # type: ignore

            prompt = params.get("prompt")
            seconds_start = params.get("secondsStart")
            seconds_total = params.get("secondsTotal")
            steps = params.get("steps")  # 100
            cfg_scale = params.get("cfgScale")  # 7

            sigma_min = 0.3
            sigma_max = 500
            sampler_type = "dpmpp-3m-sde"

            conditioning = [
                {
                    "prompt": prompt,
                    "seconds_start": seconds_start,
                    "seconds_total": seconds_total,
                }
            ]

            output = generate_diffusion_cond(
                self.model,
                steps=int(steps),
                cfg_scale=cfg_scale,
                conditioning=conditioning,  # type: ignore
                sample_size=sample_size,
                # sigma_min=sigma_min,
                # sigma_max=sigma_max,
                sampler_type=sampler_type,
                device=device,
                # return_latents=True,
                seed=np.random.randint(0, 2**32 - 1, dtype=np.uint32),
            )

            output = rearrange(output, "b d n -> d (b n)")
            wav_output = (
                output.to(torch.float32)
                .div(torch.max(torch.abs(output)))
                .clamp(-1, 1)
                .mul(32767)
                .to(torch.int16)
                .cpu()
            )

            format = "wav"
            filename = f"{uuid.uuid4()}.{format}"

            path = f'{os.getenv("OUT_DATA", "out_data")}/{filename}'
            torchaudio.save(uri=path, src=wav_output, format=format, sample_rate=sample_rate)  # type: ignore

            files = [filename]
            return {"samples": files}
