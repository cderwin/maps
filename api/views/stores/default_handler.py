from flask import abort
from util.mapping import distance, Point
from util.file_cache import FileCache

import requests
import json
import os.path

from requests import HTTPError, Timeout
from functools import reduce
from json import JSONDecodeError


class StoresHandler(object):
    def __init__(self, app):
        with open(os.path.join(app.config['ROOT_DIR'], 'api/data/store_requests.json')) as f:
            self.config = json.load(f)

    def __call__(self, **kwargs):
        return self.handle_request(**kwargs)

    def handle_request(self, **kwargs):
        lat = kwargs.get('lat')
        lon = kwargs.get('lon')
        provider = kwargs.get('provider')

        kwargs = self.verify_params(**kwargs)
        file_cache = FileCache(provider)
        data = (file_cache.check(lat, lon) or file_cache.write(lat, lon, data=self.make_request(**kwargs)))['results']
        data = self.sanitize_fields(data, **kwargs)
        data = self.serialize_data(data, **kwargs)
        return json.dumps(data), 200, {'Content-Type': 'application/json'}


    def verify_params(self, **kwargs):
        if not kwargs.get('provider') in self.config.keys():
            abort(404)
        try:
            float(kwargs.get('lat'))
            float(kwargs.get('lon'))
        except:
            abort(404)
        return kwargs


    def make_request(self, **kwargs):
        provider = kwargs.get('provider')

        headers = self.get_headers(**kwargs)
        url = self.get_url(**kwargs)

        try:
            response = requests.get(url, headers=headers)
            data = response.json()
        except Timeout:
            abort(504)
        except (HTTPError, JSONDecodeError):
            abort(502)

        if 'results_field' in self.config[provider]:
            return data[self.config[provider]['results_field']]
        else:
            return data

    def get_headers(self, **kwargs):
        return self.config[kwargs['provider']].get('headers', {})

    def get_url(self, **kwargs):
        return self.config[kwargs['provider']]['url'].format(lat=kwargs['lat'], lon=kwargs['lon'])

    def sanitize_fields(self, data, **kwargs):
        results = []
        for store in data:
            store_data = {}
            for name, field in self.config[kwargs.get('provider')].get('data_mapping', {}).items():
                keys = field.strip().split('.')
                val = store
                for key in keys:
                    val = val[key]
                store_data[name] = val
            results.append(store_data)

        return results


    def serialize_data(self, data, **kwargs):
        lat = kwargs.get('lat')
        lon = kwargs.get('lon')

        max_distance = 0
        for store in data:
            max_distance = max(max_distance, distance(store, Point(lat, lon)))

        results = {
            "results": data,
            "meta": {
                "count": len(data),
                "center": {
                    "lon": float(lon),
                    "lat": float(lat)
                },
                "max_distance": max_distance
            }
        }

        return results
