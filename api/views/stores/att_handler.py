from .default_handler import StoresHandler


class ATTStoresHandler(StoresHandler):
    def handle_request(self, **kwargs):
        kwargs.update({'provider': 'att'})
        return super(ATTStoresHandler, self).handle_request(**kwargs)

    def get_url(self, **kwargs):
        lat = float(kwargs.get('lat'))
        lon = float(kwargs.get('lon'))

        sw_corner = "{0},{1}".format(lat - 1, lon - 1)
        ne_corner = "{0},{1}".format(lat + 1, lon + 1)
        return self.config[kwargs['provider']]['url'].format(lat=lat, lon=lon, sw_corner=sw_corner, ne_corner=ne_corner)
