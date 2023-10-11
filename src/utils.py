import os
import subprocess
import sys

import torch
import gc


class MecchiUtils:
    def __init__(self):
        self.models = {}

    def register_model(self, name, model):
        print(f"🥁 mecchi: registering model '{name}'")
        self.models[name] = model

    def is_model_registered(self, name):
        return self.models.get(name, None) is not None

    def unload_model(self, name):
        print(f"🥁 mecchi: unloading model '{name}'")
        model = self.models.pop(name, None)
        if model is not None:
            model.to("cpu")
            self.clear_cuda()

    def unload_models(self):
        models = list(self.models.keys())
        for name in models:
            self.unload_model(name)

    def clear_cuda(self):
        if torch.cuda.is_available():
            with torch.cuda.device("cuda"):
                torch.cuda.empty_cache()
                torch.cuda.ipc_collect()
        gc.collect()
