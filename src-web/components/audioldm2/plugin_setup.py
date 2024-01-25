import shutil
import subprocess
import sys
import os
import tempfile


def setup():
    activate_venv = bool(os.environ.get("ACTIVATE_VENV", "True"))

    current_path = os.getcwd()
    root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    os.chdir(root)
    venv_name = "mecchi_venv"
    if os.name == "posix":
        activate_script = f". {venv_name}/bin/activate"
    elif os.name == "nt":
        activate_script = f"{venv_name}\\Scripts\\activate.bat"

    if activate_venv:
        subprocess.run(activate_script, shell=True)

    subprocess.run(["pip", "install", "audioldm2==0.1.0", "--no-deps"], check=True)

    os.chdir(current_path)
