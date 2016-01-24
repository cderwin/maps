import os
import os.path
import routes

from flask import Flask
from flask.ext.assets import Environment as AssetsEnvironment, Bundle

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
assets = AssetsEnvironment(app)

vendored_js = Bundle('vendor/js/jquery.js', 'vendor/js/*', filters='jsmin')
vendored_css = Bundle('vendor/css/*', filters='cssmin')

js = Bundle(vendored_js, 'static/js/*',
            filters='jsmin',
            output='application.js')

css = Bundle(vendored_css, 'static/css/*',
             filters='cssmin',
             output='application.css')

assets.register('js', js)
assets.register('css', css)

# Set up routes
routes.wire(app)

if __name__ == '__main__':
    app.run()
