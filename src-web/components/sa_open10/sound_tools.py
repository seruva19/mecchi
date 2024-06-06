import json
import os
from stable_audio_tools.models.factory import create_model_from_config
from stable_audio_tools.models.utils import load_ckpt_state_dict
import torch


def trim_output_silence(audio_tensor):
    flipped = torch.flip(audio_tensor, [1])

    non_zero_indices = torch.nonzero(flipped, as_tuple=True)[1]

    if non_zero_indices.size(0) == 0:
        return torch.empty_like(audio_tensor)

    last_non_zero = audio_tensor.size(1) - torch.min(non_zero_indices) - 1

    trimmed = audio_tensor[:, : last_non_zero + 1]

    return trimmed
