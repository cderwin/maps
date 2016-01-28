import os
import os.path
import routes

from flask import Flask

config = {
    "local": "config.BaseConfig",
}

app = Flask(__name__, static_folder='assets')

# Load config
config_name = os.environ.get("MAPS_ENV", 'local')
app.config.from_object(config.get(config_name, 'config.default'))

cfg_path = '/etc/maps/app.cfg'
if os.path.isfile(cfg_path):
    app.config.from_pyfile(cfg_path)


# Set up routes
routes.wire(app)

if __name__ == '__main__':
    app.run()
