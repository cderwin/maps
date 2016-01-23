import os
import routes

from flask import Flask

app = Flask(__name__, static_folder='assets')
app.config['DEBUG'] = True

routes.wire(app)

if __name__ == '__main__':
    app.run()
