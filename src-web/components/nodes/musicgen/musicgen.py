from audiocraft.models.musicgen import MusicGen
from audiocraft.data.audio import audio_write
from flask import Flask, request
import uuid


def plugin():
    return AudiocraftPlugin


class AudiocraftPlugin:
    def __init__(self):
        self.model_type = "facebook/musicgen-melody"
        self.musicgen = None

    def load(self, app: Flask, mecchi_utils):
        @app.route("/mecchi/musicgen", methods=["POST"])
        def musicgen_inference():
            params = request.get_json()
            print(f"running musicgen inference with params {params}")

            device = params.get("device")
            model = params.get("model")
            prompt = params.get("prompt")
            useSampling = params.get("useSampling")
            topK = params.get("topK")
            topP = params.get("topP")
            temperature = params.get("temperature")
            duration = params.get("duration")
            cfgScale = params.get("cfgScale")
            twoStepCfg = params.get("twoStepCfg")
            extendStride = params.get("extendStride")

            if (
                not mecchi_utils.is_model_registered("musicgen:compression_model")
                or self.musicgen is None
                or self.model_type != model
            ):
                self.model_type = model
                self.musicgen = MusicGen.get_pretrained(self.model_type, device)

                mecchi_utils.register_model(
                    "musicgen:compression_model", self.musicgen.compression_model
                )
                mecchi_utils.register_model("musicgen:lm", self.musicgen.lm)

            self.musicgen.set_generation_params(
                use_sampling=useSampling,
                top_k=int(topK),
                top_p=float(topP),
                temperature=float(temperature),
                duration=float(duration),
                cfg_coef=float(cfgScale),
                two_step_cfg=twoStepCfg,
                extend_stride=float(extendStride),
            )

            descriptions = [prompt]
            wav = self.musicgen.generate(
                descriptions, progress=True, return_tokens=False
            )
            format = "wav"

            files = []
            for idx, one_wav in enumerate(wav):
                filename = uuid.uuid4()

                path = f"out_data/{filename}"
                audio_write(
                    stem_name=path,
                    wav=one_wav.cpu(),
                    sample_rate=self.musicgen.sample_rate,
                    format=format,
                    mp3_rate=320,
                    normalize=True,
                    strategy="loudness",
                    peak_clip_headroom_db=1,
                    rms_headroom_db=18,
                    loudness_headroom_db=14,
                    loudness_compressor=True,
                    log_clipping=True,
                    make_parent_dir=True,
                    add_suffix=True,
                )
                files.append(f"{filename}.{format}")

            return {"samples": files}
