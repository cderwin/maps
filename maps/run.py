import os
import routes

from flask import Flask

app = Flask(__name__, static_folder='assets', instance_path='config', instance_relative_config=True)
routes.wire(app)

environment = os.environ.get('MAPS_ENV', 'local')

if __name__ == '__main__':
    app.run()
