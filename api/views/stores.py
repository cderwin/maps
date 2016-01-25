from flask import abort, app
from util.mapping import distance
from util.file_cache import FileCache

import requests
import json


def stores(provider, lat, lon):
    file_cache = FileCache('vz-api')
    data = file_cache.check(lat, lon) or file_cache.write(lat, lon, data=make_request(lat, lon))
    data = sanitize_fields(data)
    data = serialize_data(data, lat, lon)
    return data, 200


def make_request(lat, lon, strict=False):
    store_type = 'all' if not strict else 'verizon'

    headers = {
        "Accept": "application/json",
        "User-Agent": "Mozilla 5.0"
    }

    url = ("http://www.verizonwireless.com/vzw/rest/storelocatorProximitySearchJson.jsp"
           "?latitude={0}&longitude={1}&authRetailerType={2}"
           .format(lat, lon, store_type))

    try:
        response = requests.get(url, headers=headers)
        data = response.json()
    except (HTTPError, JsonDecodeError):
        abort(504)

    return data


whitelisted_fields = {
    "name": "title",
    "lat": "lat",
    "lon": "lng"
}


def get_value(field, store):
    if isinstance(field, str):
        field_arr = field.strip().split('.')
        value = reduce(field_arr, (lambda a, f: a.get(f, {})), store) or None
    elif callable(field):
        value = field(store)


def sanitize_fields(data):
    data = [{name: get_value(field, store) for name, field in filter(lambda x: isinstance(x, str) or callable(x), whitelisted_fields)} for store in data]
    return data


def serialize_data(data, lon, lat):
    results = {
        "results": data,
        "meta": {
            "count": len(data),
            "center": {
                "lon": float(lon),
                "lat": float(lat)
            },
            "max_distance": reduce(data, (lambda a, x: max(a, distance(x, Point(lat, lon)))), 0)
        }
    }

    return results
