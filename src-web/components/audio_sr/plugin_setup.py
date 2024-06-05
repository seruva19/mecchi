import shutil
import subprocess
import sys
import os
import tempfile
from pathlib import Path

repo_url = "https://github.com/haoheliu/versatile_audio_super_resolution.git"
commit_hash = "3e90b6c"


def setup():
    current_path = os.getcwd()

    temp_dir = tempfile.mkdtemp()
    temp_audiosr = os.path.join(temp_dir, "audio_sr")

    subprocess.run(["git", "clone", repo_url, temp_audiosr])
    os.chdir(temp_audiosr)
    subprocess.run(["git", "checkout", commit_hash])
    os.chdir(current_path)

    tmp_subdirectory_path = os.path.join(temp_audiosr, "audiosr")
    destination_dir = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "audiosr"
    )

    if not os.path.exists(destination_dir):
        shutil.copytree(tmp_subdirectory_path, destination_dir)

    try:
        shutil.rmtree(temp_dir)
    except:
        pass
