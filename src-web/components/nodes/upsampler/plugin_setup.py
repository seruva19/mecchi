import shutil
import subprocess
import sys
import os
import tempfile
from pathlib import Path

repo_url = "https://github.com/haoheliu/versatile_audio_super_resolution.git"
commit_hash = "3e90b6c"
local_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "audiosr")


def setup():
    current_path = os.getcwd()

    temp_dir = tempfile.mkdtemp()
    temp_audiosr = os.path.join(temp_dir, "audiosr")

    subprocess.run(["git", "clone", repo_url, temp_audiosr])
    os.chdir(temp_audiosr)
    subprocess.run(["git", "checkout", commit_hash])
    os.chdir(current_path)

    subdirectory_path = os.path.join(temp_audiosr, "audiosr")
    destination_dir = Path(local_path).parent

    if os.path.exists(subdirectory_path) and os.path.isdir(subdirectory_path):
        destination_subdirectory = os.path.join(destination_dir, "audiosr")
        shutil.copytree(subdirectory_path, destination_subdirectory)
    shutil.rmtree(temp_dir)
