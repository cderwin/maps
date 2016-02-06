from flask import request

class View(object):
    http_method_names = ('get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace')

    @classmethod
    def as_func(cls, **initkwargs):
        def view(request, *args, **kwargs):
            self = cls(**initkwargs)
            if hasattr(self, 'get') and not hasattr(self, 'head'):
                self.head = self.get

            self.dispatch(request)
            return self.response

        view.cls = cls
        return view

    def options(self, request, *args, **kwargs):
        headers = {
            "Allow": ', '.join(self.allowed_methods),
            "Content-Length": 0
        }

        return '', 200, headers

    def http_method_not_allowed(self, request, *args, **kwargs):
        return "Method not allowed", 405, self._default_headers

    @property
    def allowed_methods(self):
        return [method.upper() for method in self.http_method_names if hasattr(self, method)]

    @property
    def default_response_headers(self):
        headers = {
            "Allow": ', '.join(self.allowed_methods)
        }
        return headers

    # Dispatch methods
    def initialize_request(self, request, *args, **kwargs):
        return request

    def initial(self, request, *args, **kwargs):
        pass

    def finalize_response(self, request, response, *args, **kwargs):
        return response

    def handle_exception(self, exc):
        if hasattr(exc, 'handler'):
            return exc.handler()

        return 'An unhandled exception occurred', 500, self.default_response_headers

    def dispatch(self, request, *args, **kwargs):
        self.args = args
        self.kwargs = kwargs
        request = self.initialize_request(request)
        self.request = request
        self.headers = self.default_response_headers

        try:
            self.initial(request, *args, **kwargs)
            
            if request.method.lower() in self.http_method_names:
                handler = getattr(self, request.method.lower, self.http_method_not_allowed)
            else:
                handler = self.http_method_not_allowed

            response = handler(request, *args, **kwargs)

        except Exception as exc:
            response = self.handle_exception(exc)

        self.response = self.finalize_response(response)
        return self.response
