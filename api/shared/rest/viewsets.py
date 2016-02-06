from . import views


class ViewSetMixin(object):
    @classmethod
    def as_func(cls, actions=None, **initkwargs):
        cls.suffix =None

        if not actions:
            raise TypeError("Actions cannot be empty")

        def view(*args, **kwargs):
            self = cls(**initkwargs)
            self.action_map = actions

            for method, action in self.action_map.items():
                handler = getattr(self, action)
                setattr(self, method, handler)

            if hasattr(self, 'get') and not hasattr(self, 'head'):
                self.head = self.get

            return self.dispatch(request, *args, **kwargs)

        view.cls = cls
        view.suffix = initkwargs.get('suffix')
        return view

    def initialize_request(self, request, *args, **kwargs):
        request = super(ViewSetMixin, self).initialize_request(request, *args, **kwargs)
        method = request.method.lower()
        if method == 'options':
            self.action = 'metadata'
        else:
            self.action = self.action_map.get(method)
        return request


class ViewSet(ViewSetMixin, views.View):
    pass
