import os
import os.path
import routes

from flask import Flask
from flask.ext.assets import Environment as AssetsEnvironment, Bundle
from webassets.filter import register_filter
from extensions.webassets.filters.node_sass import NodeSass
from webassets_babel import BabelFilter

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

# Bundle assets
register_filter(NodeSass)
register_filter(BabelFilter)
assets = AssetsEnvironment(app)

js = Bundle('vendor/js/jquery.js', 'vendor/js/*', 'static/js/*',
            filters='babel,jsmin',
            output='application.js')

css = Bundle('static/scss/main.scss',
             filters='node-sass,cssmin',
             output='application.css')

assets.register('js', js)
assets.register('css', css)

# Set up routes
routes.wire(app)

if __name__ == '__main__':
    app.run()
