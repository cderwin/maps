import os.path

class BaseConfig(object):
    # Flask Config
    DEBUG = True
    SERET_KEY = 'iZgNRyaLnDAaM7C7Ah0RazkafhGBh4ir7ey02ocA9CVgdz3DAYcZzU2LZ0rucck YN7dKLOwgV90Nc+OrRq0fg'

    # App Config
    ROOT_DIR = os.path.realpath(__file__ + '../../..')
    NODE_BIN = os.path.join(os.path.dirname(ROOT_DIR), 'node_modules/.bin')
    TMP_DIR = os.path.join(ROOT_DIR, 'tmp')

    # webassets config
    ASSETS_DEBUG = False

    NODE_SASS_BIN = os.path.join(NODE_BIN, 'node-sass')
    NODE_SASS_LOAD_PATHS = (os.path.join(ROOT_DIR, 'assets/static/scss'), os.path.join(ROOT_DIR, 'assets/vendor/scss'),)

    BABEL_BIN = os.path.join(NODE_BIN, 'babel')
