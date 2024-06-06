import json
import os
from stable_audio_tools.models.factory import create_model_from_config
from stable_audio_tools.models.utils import load_ckpt_state_dict


def get_preloaded_model(cache_dir: str, model_name: str):
    try:
        model_config_path = os.path.join(cache_dir, model_name, "model_config.json")

        with open(model_config_path) as f:
            model_config = json.load(f)

        model = create_model_from_config(model_config)

        model_ckpt_path = os.path.join(cache_dir, model_name, "model.safetensors")
        model.load_state_dict(load_ckpt_state_dict(model_ckpt_path))

        return model, model_config
    except:
        return None, None
