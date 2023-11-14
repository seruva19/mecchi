import os
import subprocess
import sys
from flask import Flask
import importlib
import importlib.util

from utils import MecchiUtils

plugins_folder = "plugins"


class PluginsLoader:
    def __init__(self):
        os.environ["HF_HOME"] = "cache"

    def assemble(self, app: Flask, utils: MecchiUtils):
        print("🥁 mecchi: loading plugins")
        plugin_folders = [
            f for f in os.listdir(plugins_folder) if not f.startswith(".")
        ]

        print(
            f"🥁 mecchi: found {len(plugin_folders)} plugins: {str.join(',', plugin_folders)}"
        )
        for folder_name in plugin_folders:
            folder_path = os.path.join(plugins_folder, folder_name)

            if os.path.isdir(folder_path):
                sys.path.append(folder_path)

                setup_path = os.path.join(folder_path, "plugin_setup.py")
                reqs_path = os.path.join(folder_path, "requirements.txt")
                metadata_path = os.path.join(folder_path, ".metadata")

                custom_setup_success = False
                requirements_install_success = False
                if not os.path.exists(metadata_path):
                    if os.path.exists(setup_path):
                        print(
                            f"🥁 mecchi: initiating custom setup script for plugin: '{folder_name}'"
                        )
                        custom_setup_success = self.custom_setup(
                            folder_name, setup_path
                        )
                    else:
                        custom_setup_success = True

                    if os.path.exists(reqs_path):
                        print(
                            f"🥁 mecchi: installing requirements for plugin: '{folder_name}'"
                        )
                        requirements_install_success = self.install_reqs(reqs_path)

                    if custom_setup_success or requirements_install_success:
                        print(
                            f"🥁 mecchi: plugin '{folder_name}' successfully installed"
                        )
                        with open(metadata_path, "w") as file:
                            pass

                plugin_module_path = os.path.join(folder_path, f"{folder_name}.py")
                if os.path.exists(plugin_module_path):
                    try:
                        spec = importlib.util.spec_from_file_location(
                            f"{folder_name}", plugin_module_path
                        )

                        if spec is not None:
                            module = importlib.util.module_from_spec(spec)
                            sys.modules[folder_name] = module
                            if spec.loader is not None:
                                spec.loader.exec_module(module)
                                cls = module.plugin()
                                instance = cls()
                                instance.load(app, utils)
                                print(f"🥁 mecchi: plugin '{folder_name}' loaded")

                    except Exception as e:
                        print(f"⛔ mecchi: error '{e}'")
                        raise
                else:
                    print(f"⛔ mecchi: module '{plugin_module_path}' not found")

    def custom_setup(self, folder_name, setup_path):
        try:
            spec = importlib.util.spec_from_file_location(f"{folder_name}", setup_path)
            if spec is not None:
                module = importlib.util.module_from_spec(spec)

                if spec.loader is not None:
                    spec.loader.exec_module(module)
                    module.setup()
                    return True

        except Exception as e:
            return False

    def install_reqs(self, requirements_file_path):
        activate_venv = os.environ.get("ACTIVATE_VENV", "False") == "True"
        try:
            venv_name = "mecchi_venv"

            if os.name == "posix":
                venv_activation_path = os.path.join(venv_name, "bin", "activate")
                if activate_venv:
                    activate_script = f". {venv_activation_path} && {sys.executable} -m pip install -r {requirements_file_path}"
                else:
                    activate_script = (
                        f"{sys.executable} -m pip install -r {requirements_file_path}"
                    )
            elif os.name == "nt":
                venv_activation_path = os.path.join(
                    venv_name, "Scripts", "activate.bat"
                )
                if activate_venv:
                    activate_script = f"call {venv_activation_path} && {sys.executable} -m pip install -r {requirements_file_path}"
                else:
                    activate_script = (
                        f"{sys.executable} -m pip install -r {requirements_file_path}"
                    )

            subprocess.run(activate_script, shell=True)
            return True
        except Exception as e:
            return False
