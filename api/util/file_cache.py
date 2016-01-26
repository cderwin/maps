import os.path
import json

from flask import current_app as app
from functools import reduce
from .mapping import distance


class FileCache(object):
    def __init__(self, name, base_dir=None, meta_func=None):
        base_dir = base_dir or app.config['TMP_DIR']
        self.base = os.path.join(base_dir, name)
        if not os.path.isdir(self.base):
            os.mkdir(self.base)

        if meta_func is not None:
            self.meta_func = meta_func
        else:
            def default_meta(data, keydata):
                return {"key": ','.join(keydata)}
            self.meta_func = default_meta

    def fname(self, *keydata):
        fname = reduce((lambda a, x: os.path.join(a, x)), keydata, self.base)
        return fname

    def check(self, *keydata):
        fname = self.fname(*keydata)
        if os.path.isfile(fname):
            return self.read(*keydata)
        return None

    def read(self, *keydata, fname=None):
        fname = fname or self.fname(*keydata)
        with open(fname) as f:
            # Read header
            assert f.readline().startswith('---')
            meta = {}
            for line in f:
                if line.startswith('---'):
                    break
                key, value = map(lambda x: x.strip(), line.strip().split(':', 1))
                meta[key] = value

            # Read body
            data = json.load(f)

        return {"results": data, "meta": meta}


    def write(self, *keydata, fname=None, data=None):
        if data is None:
            raise ValueError("No data passed to write")
        fname = fname or self.fname(*keydata)
        if not os.path.isdir(os.path.dirname(fname)):
            os.mkdir(os.path.dirname(fname))

        header = "---\n{0}---\n".format(
                reduce(
                       lambda x, a: x + "{0}: {1}\n".format(a[0], a[1]),
                       self.meta_func(data, keydata).items(),
                       ''
                )
        )

        with open(fname, 'w') as f:
            f.write(header)
            json.dump(data, f)

        return self.read(fname=fname)
