import os
from typing import Any
from audiocraft.models.musicgen import MusicGen
from audiocraft.data.audio import audio_write
import uuid


class AudiocraftEnvironment:
    def __init__(self):
        self.lm = None
        self.lm_type = "facebook/musicgen-melody"
        self.cm = None
        self.cm_type = "facebook/musicgen-melody"

        self.musicgen: Any = None
        self.model_type = "facebook/musicgen-melody"

    def load(self, model, device, mecchi_utils):
        if (
            not mecchi_utils.is_model_registered("musicgen:cm")
            or self.musicgen is None
            or self.model_type != model
        ):
            self.model_type = model
            self.musicgen = MusicGen.get_pretrained(self.model_type, device)

            mecchi_utils.register_model("musicgen:lm", self.musicgen.lm)
            mecchi_utils.register_model("musicgen:cm", self.musicgen.compression_model)

    def load_lm(self):
        pass

    def load_cm(self):
        pass

    def load_mbd(self):
        pass

    def generate_sample(self):
        pass

    def generate_continuation(self):
        pass
