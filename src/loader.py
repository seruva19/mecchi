import os
import subprocess
import sys
from flask import Flask
import importlib
import importlib.util

from utils import MecchiUtils

root_folder = "src-web/components"


class NodeLoader:
    def __init__(self):
        os.environ["HF_HOME"] = "cache"

    def assemble(self, app: Flask, utils: MecchiUtils):
        print("🎧 retrieving components metadata")
        folders = [f for f in os.listdir(root_folder) if not f.startswith(".")]

        folders_with_plugins = self.find_folders_with_files(folders, "py", root_folder)

        print(
            f"🎧 found {len(folders_with_plugins)} plugins: {str.join(',', folders_with_plugins)}"
        )

        skipped_plugins = os.environ.get("SKIP_PLUGINS", None)
        skipped_plugins_list = (
            [] if skipped_plugins is None else str.split(skipped_plugins, ",")
        )
        if len(skipped_plugins_list) > 0:
            print(f"🎧 following plugins are disabled via cli: {skipped_plugins}")

        for folder_name in folders_with_plugins:
            if not folder_name in skipped_plugins_list:
                folder_path = os.path.join(root_folder, folder_name)

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
                                f"🎧 initiating custom setup script for plugin: '{folder_name}'"
                            )
                            custom_setup_success, err_setup = self.custom_setup(
                                folder_name, setup_path
                            )
                        else:
                            custom_setup_success = True

                        if os.path.exists(reqs_path):
                            print(
                                f"🎧 installing requirements for plugin: '{folder_name}' \
                            "
                            )
                            requirements_install_success, err_install = (
                                self.install_reqs(reqs_path)
                            )
                        else:
                            requirements_install_success = True

                        if custom_setup_success and requirements_install_success:
                            print(f"🎧 plugin '{folder_name}' successfully installed")
                            with open(metadata_path, "w") as file:
                                pass
                        else:
                            print(
                                f"⛔ problems detected while installing module '{plugin_module_path}': {err_setup if err_install is None else err_install}"
                            )

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
                                    print(f"🎧 plugin '{folder_name}' loaded")

                        except Exception as e:
                            print(f"⛔ error '{e}'")
                            raise
                    else:
                        print(f"⛔ module '{plugin_module_path}' not found")

        node_paths = self.find_files_with_nodes(folders, "tsx", root_folder)
        nodes = [os.path.basename(file_path) for file_path in node_paths]

        nodes_info = str.join(",", [os.path.splitext(node)[0] for node in nodes])
        print(f"🎧 found {len(nodes)} nodes: {nodes_info}")

        skipped_nodes = os.environ.get("SKIP_NODES", None)
        skipped_nodes_list = (
            [] if skipped_nodes is None else str.split(skipped_nodes, ",")
        )
        if len(skipped_nodes_list) > 0:
            print(f"🎧 following nodes are disabled via cli: {skipped_nodes}")

        node_paths = [
            node_path
            for node_path in node_paths
            if not any(
                node_path.endswith(skipped_node + ".tsx")
                for skipped_node in skipped_nodes_list
            )
        ]

        node_paths = [
            node_path for node_path in node_paths if not node_path in skipped_nodes_list
        ]

        web_node_paths = [
            os.getenv("NODE_PATHS", "../components/") + path.replace("\\", "/")
            for path in node_paths
        ]

        return web_node_paths

    def custom_setup(self, folder_name, setup_path):
        try:
            spec = importlib.util.spec_from_file_location(f"{folder_name}", setup_path)
            if spec is not None:
                module = importlib.util.module_from_spec(spec)

                if spec.loader is not None:
                    spec.loader.exec_module(module)
                    module.setup()
                    return True, None

            return False, ModuleNotFoundError(
                f"cannot import module from '{folder_name}'"
            )
        except Exception as e:
            return False, e

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
            return True, None
        except Exception as e:
            return False, e

    def find_folders_with_files(self, folders, extension, base_directory):
        return [
            folder
            for folder in folders
            if os.path.isdir(os.path.join(base_directory, folder))
            and f"{folder}.{extension}"
            in os.listdir(os.path.join(base_directory, folder))
        ]

    def find_files_with_nodes(self, folders, extension, base_directory):
        file_paths = []
        for folder in folders:
            folder_path = os.path.join(base_directory, folder)
            if os.path.isdir(folder_path):
                for file in os.listdir(folder_path):
                    if file.endswith(f".{extension}"):
                        file_path = os.path.join(
                            folder, file
                        )  # Combines the folder name and the file name
                        file_paths.append(file_path)
        return file_paths
