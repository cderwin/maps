from math import sin, cos, asin, sqrt, radians


class Point(object):
    def __init__(self, lat, lon, unit='deg'):
        self.lat = float(lat)
        self.lon = float(lon)
        self.unit = unit

    def __getitem__(self, key):
        if key.lower() in ('lat', 'latitude'):
            return self.lat
        if key.lower() in ('lon', 'longitude'):
            return self.lon
        raise KeyError('Key not \"lat\" or \"lon\"')

    def __setitem__(self, key, value):
        if key.lower() in ('lat', 'latitude'):
            self.lat = value
        if key.lower() in ('lon', 'longitude'):
            self.lon = value
        raise keyerror('key not \"lat\" or \"lon\"')

    def __delitem__(self, key):
        if key.lower() in ('lat', 'latitude'):
            self.lat = None
        if key.lower() in ('lat', 'latitude'):
            self.lon = None
        raise keyerror('key not \"lat\" or \"lon\"')

    def __iter__(self):
        return {"lat": self.lat, "lon": self.lon}

    @classmethod
    def to_radians(cls, point):
        if point.unit != 'rad':
            lat = radians(point.lat)
            lon = radians(point.lon)
            return cls(lat, lon, unit='rad')
        return point

    @classmethod
    def to_point(cls, d):
        return cls(float(d['lat']), float(d['lon']))


earth_radius = {
    'mi': 3959,
    'km': 6371
}


def distance(p1, p2, units='mi'):
    # Here I implement the Haversine formula: https://en.wikipedia.org/wiki/Haversine_formula
    p1 = Point.to_radians(p1 if isinstance(p1, Point) else Point.to_point(p1))
    p2 = Point.to_radians(p2 if isinstance(p2, Point) else Point.to_point(p2))

    delta_lat = p1.lat - p2.lat
    delta_lon = p1.lon - p2.lon

    a = sin(delta_lat / 2) ** 2 + cos(p1.lat) * cos(p2.lat) * sin(delta_lon / 2) ** 2
    c = 2 * asin(sqrt(a))

    r = earth_radius[units] * c
    return r
