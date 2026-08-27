import os
import uuid
from flask import Flask, request
from diffusers import AudioLDM2Pipeline
import torch
import scipy


def plugin():
    return Wav2AnyPlugin


class Wav2AnyPlugin:
    def __init__(self):
        pass

    def load(self, app: Flask, mecchi_utils):
        @app.route("/mecchi/wav2any", methods=["POST"])
        def wav2any_convert():
            params = request.get_json()
            print(f"running wav2any with params {params}")

            return {"samples": None}
