from flask import Flask
from diffusers import AudioLDM2Pipeline


def plugin():
    return AudioLdm2Plugin


class AudioLdm2Plugin:
    def __init__(self):
        pass

    def load(self, app: Flask, mecchi_utils):
        @app.route("/mecchi/audioldm2", methods=["POST"])
        def audioldm2_inference(params):
            return []
