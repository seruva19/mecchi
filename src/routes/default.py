import os
import uuid
from flask import Flask, render_template, request, send_from_directory
from werkzeug.utils import secure_filename
from utils import MecchiUtils


def define_routes(app: Flask, mecchi_utils: MecchiUtils):
    @app.route("/", methods=["GET"])
    def index():
        return render_template("index.html")

    @app.route("/out_data/<path:filename>")
    def serve_static(filename):
        out_dir = os.getenv("OUT_DATA", default="out_data")
        return send_from_directory(out_dir, filename)

    @app.route("/mecchi/init", methods=["GET"])
    def initial_config(filename):
        return {}

    @app.route("/mecchi/upload", methods=["POST"])
    def upload():
        out_dir = os.getenv("OUT_DATA", default="out_data")
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

    @app.route("/mecchi/workflow/read", methods=["POST"])
    def read():
        return {"mecchi": "👍"}

    @app.route("/mecchi/workflow/write", methods=["POST"])
    def write():
        return {"mecchi": "👍"}
