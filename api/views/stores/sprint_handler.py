from .default_handler import StoresHandler
from util.mapping import distance

import os.path
import json


class SprintStoresHandler(StoresHandler):
    def __init__(self, app):
        super(SprintStoresHandler, self).__init__(app)
        with open(os.path.join(app.config['ROOT_DIR'], 'api/data/zipcode_coordinates.json')) as f:
            self.zips = json.load(f)

    def handle_request(self, **kwargs):
        kwargs.update({"provider": "sprint"})
        return super(SprintStoresHandler, self).handle_request(**kwargs)

    def get_url(self, **kwargs):
        zipcode = self.get_zip(kwargs['lat'], kwargs['lon'])
        return self.config[kwargs['provider']]['url'].format(zip=zipcode)

    def get_zip(self, lat, lon):
        coords = {"lat": lat, "lon": lon}
        result = (self.zips[0]['zip'], distance(self.zips[0]['point'], coords))
        for zipcode in self.zips[1:]:
            if distance(zipcode['point'], coords) < result[1]:
                result = (zipcode['zip'], distance(zipcode['point'], coords))

        return result[0]
