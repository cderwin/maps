import os.path
import json

from flask import current_app as app
from .mapping import distance

class FileCache(object):
    def __init__(self, name, base_dir=None):
        base_dir = base_dir or app.config['TMP_DIR']
        self.base = os.path.join(base_dir, name)

    def fname(self, *keydata):
        fname = reduce(keydata, (lambda a, x: os.path.join(a, x)), self.base)
        return fname

    def check(self, *keydata):
        fname = self.fname(*keydata)
        if os.path.isfile(fname):
            return self.read(*keydata)
        return None

    def read(*keydata, fname=None):
        fname = fname or self.fname(*keydata)
        with open(fname) as f:
            # Read header
            assert f.readline().startswith('---')
            meta = {}
            for line in f:
                if line.startswith('---'):
                    break
                key, value = map(strip, line.strip().split(':', 1))
                meta[key] = value

            # Read body
            data = json.load(f)

        return {"results": data, "meta": meta}


    def write(*keydata, fname=None, data=None):
        if data in None:
            raise ValueError("No data passed tow write")
        fname = fname or self.fname(*keydata)
        max_distance = reduce(stores, (lambda a, store: max(a, distance(store, {"lat": lat, "lon": lon}))), 0) 
        header = """
            ---
            lat: {0}
            lon: {1}
            max_distance: {2}
            ---
            """.format(lat, lon, max_distance)

        with open(fname, 'w') as f:
            f.write(header)
            json.load(f, data)

        return data
