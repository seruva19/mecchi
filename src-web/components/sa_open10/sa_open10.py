import os
from typing import Any

import numpy as np
import torch
import torchaudio
from einops import rearrange
from stable_audio_tools import get_pretrained_model
from stable_audio_tools.inference.generation import generate_diffusion_cond

from hf_tools import get_preloaded_model
from sound_tools import trim_output_silence

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
            use_float16 = params.get("useHalfPrecision")

            print(f"running stable-audio-open (1.0) inference with params {params}")

            error = None
            if self.model is None:
                model, model_config = get_preloaded_model(
                    "cache", "stable-audio-open-1.0"
                )

                if model is None:
                    token_path = os.path.join("keys", "hf_token")
                    try:
                        with open(token_path, "r") as file:
                            token = file.read()

                            os.environ["HF_TOKEN"] = token
                            model, model_config = get_pretrained_model(
                                "stabilityai/stable-audio-open-1.0"
                            )

                    except:
                        error = f"failed to locate key file at {token_path}"
                        mecchi_utils.error(error)

                if error is None:
                    self.model = model.to(device)  # type: ignore
                    self.model_config = model_config

                    if use_float16:
                        self.model = self.model.to(torch.float16)

                    mecchi_utils.register_model("stable-audio-open-1.0", self.model)

            if error is None:
                sample_rate = self.model_config["sample_rate"]  # type: ignore
                sample_size = self.model_config["sample_size"]  # type: ignore

                prompt = params.get("prompt")
                negative_prompt = params.get("negativePrompt")

                seconds_start = params.get("secondsStart")
                seconds_total = params.get("secondsTotal")
                steps = params.get("steps")  # 100
                cfg_scale = params.get("cfgScale")  # 7

                sigma_min = params.get("sigmaMin")  # 0.3
                sigma_max = params.get("sigmaMax")  # 500
                sampler_type = params.get("sampler")  # "dpmpp-3m-sde"

                trim_silence = params.get("trimSilence")

                batch_size = 1
                conditioning = [
                    {
                        "prompt": prompt,
                        "seconds_start": seconds_start,
                        "seconds_total": seconds_total,
                    }
                ] * batch_size

                negative_conditioning = (
                    [
                        {
                            "prompt": negative_prompt,
                            "seconds_start": seconds_start,
                            "seconds_total": seconds_total,
                        }
                    ]
                    * batch_size
                    if negative_prompt is not None
                    else None
                )

                output = generate_diffusion_cond(
                    self.model,
                    steps=int(steps),
                    cfg_scale=cfg_scale,
                    conditioning=conditioning,  # type: ignore
                    conditioning_tensors=None,
                    negative_conditioning=negative_conditioning,  # type: ignore
                    negative_conditioning_tensors=None,
                    batch_size=1,
                    sample_rate=sample_rate,
                    sample_size=sample_size,
                    device=device,
                    return_latents=False,
                    init_audio=None,
                    init_noise_level=1.0,
                    mask_args=None,  # type: ignore
                    seed=np.random.randint(0, 2**32 - 1, dtype=np.uint32),
                    # seed=-1,
                    sigma_min=sigma_min,
                    sigma_max=sigma_max,
                    sampler_type=sampler_type,
                )

                output = rearrange(output, "b d n -> d (b n)")
                if use_float16:
                    wav_output = (
                        output.to(torch.float32)
                        .div(torch.max(torch.abs(output)))
                        .clamp(-1, 1)
                        .mul(32767)
                        .to(torch.int16)
                        .cpu()
                    )
                else:
                    wav_output = output.to(torch.int16).cpu()

                if trim_silence:
                    wav_output = trim_output_silence(wav_output)

                format = "wav"
                filename = f"{uuid.uuid4()}.{format}"

                path = f'{os.getenv("OUT_DATA", "out_data")}/{filename}'
                torchaudio.save(uri=path, src=wav_output, format=format, sample_rate=sample_rate)  # type: ignore

                files = [filename]
            return {"samples": files}
