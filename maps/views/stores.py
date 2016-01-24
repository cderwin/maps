from flask import abort, app
from utils.mapping import distance

import requests
import json


def stores(lat, lon):
    data = get_cache(lat, lon) or make_request(lat, lon)
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
    except HTTPError, JsonDecodeError:
        abort(504)

    return data


whitelisted_fields = {
    "name": "title",
    "lat": "lat",
    "lon": "lng"
}

def sanitize_fields(data):
    data = []
    for store in data:
        store_data = dict()
        for name, field in whitelisted_fields.items():
            if isinstance(field, str):
                field_arr = field.strip().split('.')
                value = reduce(field_arr, (lambda a, f: a.get(f, {})), store) or None
            else if callable(field):
                value = field(store)
            else:
                continue
            store_data[name] = value
        data.append(store_data)
    return data


def serialize_data(data, lon, lat):
    results = {
        "results": data
        "meta": {
            "count": len(data),
            "center": {
                "lon": lon,
                "lat": lat
            },
            "max_distance": reduce(data, (lambda a, x: max(a, distance(x, (lat, lon)))), 0)
        }
    }

    return results
