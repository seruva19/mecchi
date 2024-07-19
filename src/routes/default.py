import os
import uuid
from flask import Flask, render_template, request, send_from_directory
from werkzeug.utils import secure_filename
from utils import MecchiUtils
from pathlib import Path

workflows_dir = "templates"


def define_routes(app: Flask, mecchi_utils: MecchiUtils, nodes):
    @app.route("/", methods=["GET"])
    def index():
        return render_template("index.html")

    @app.route("/out_data/<path:filename>")
    def serve_static(filename):
        out_dir = os.getenv("OUT_DATA", default="out_data")
        return send_from_directory(out_dir, filename)

    @app.route("/mecchi/init", methods=["GET"])
    def initial_config(config=None):
        return {"nodes": nodes}

    @app.route("/mecchi/upload", methods=["POST"])
    def upload():
        out_dir = os.getenv("OUT_DATA", default="out_data")
        if not os.path.exists(out_dir):
            os.makedirs(out_dir)

        file = request.files["file"]
        if file:
            filename = file.filename
            if filename is not None:
                file_extension = filename.rsplit(".", 1)[1].lower()
                new_name = uuid.uuid4()
                new_filename = f"{new_name}.{file_extension}"
                new_path = os.path.join(out_dir, secure_filename(new_filename))

                file.save(new_path)
                return {
                    "mecchi": "👍",
                    "file": new_filename,
                }

        return {"mecchi": "🙄"}

    @app.route("/mecchi/unloadAll", methods=["GET"])
    def system_unload_all():
        mecchi_utils.unload_models()

        return {"mecchi": "👍"}

    @app.route("/mecchi/workflows", methods=["GET"])
    def workflows():
        workflows = []
        for root, dirs, files in os.walk(workflows_dir):
            for file in files:
                if not file.startswith("."):
                    relative_path = os.path.relpath(
                        os.path.join(root, file), workflows_dir
                    ).rsplit(".", 1)[0]
                    workflows.append(relative_path)

        return {"mecchi": "👍", "flows": workflows}

    @app.route("/mecchi/workflow/load", methods=["POST"])
    def readWorkflow():
        input = request.get_json()

        workflow_name = input["name"]
        if not workflow_name.endswith(".json"):
            workflow_name += ".json"
        workflow_path = os.path.join(workflows_dir, f"{workflow_name}")

        if not os.path.exists(workflow_path):
            return {"mecchi": "🙄"}

        with open(workflow_path, "r") as f:
            file = f.read()
        return {"mecchi": "👍", "flow": file}

    @app.route("/mecchi/workflow/save", methods=["POST"])
    def writeWorkflow():
        input = request.get_json()

        workflow_name = input["name"]
        if not workflow_name.endswith(".json"):
            workflow_name += ".json"
        print(workflow_name)
        workflow_json = input["flow"]
        workflow_path = os.path.join(workflows_dir, workflow_name)
        workflow_dir = os.path.dirname(workflow_path)

        if not os.path.exists(workflow_dir):
            os.makedirs(workflow_dir)

        with open(workflow_path, "w") as f:
            f.write(workflow_json)

        return {"mecchi": "👍"}

    @app.route("/mecchi/workflow/delete", methods=["POST"])
    def deleteWorkflow():
        input = request.get_json()

        workflow_name = input["name"]
        if not workflow_name.endswith(".json"):
            workflow_name += ".json"

        workflow_path = os.path.join(workflows_dir, workflow_name)
        try:
            os.remove(workflow_path)
            return {"mecchi": "👍"}
        except Exception as e:
            print(f"⛔ error removing flow: {e}")
            return {"mecchi": "🙄"}
