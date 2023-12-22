from flask import Flask
from plugins import PluginsLoader
from utils import MecchiUtils
from routes.default import define_routes

mecchi_utils = MecchiUtils()
plugins_loader = PluginsLoader()

app = Flask(__name__, template_folder="../dist", static_folder="../dist/assets")

nodes = plugins_loader.assemble(app, mecchi_utils)
define_routes(app, mecchi_utils, nodes)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=False, port=4444)
