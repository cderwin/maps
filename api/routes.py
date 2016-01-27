import views.index
from views.stores import StoresHandler, ATTStoresHandler, SprintStoresHandler

def wire(app):
    app.add_url_rule('/', 'index', views.index.handle_request)

    # Stores routes
    app.add_url_rule('/api/stores/att/<lat>/<lon>', 'stores_att', ATTStoresHandler(app))
    app.add_url_rule('/api/stores/sprint/<lat>/<lon>', 'stores_sprint', SprintStoresHandler(app))
    app.add_url_rule('/api/stores/<provider>/<lat>/<lon>', 'stores', StoresHandler(app))

    # app.add_url_rule('/api/census/<category>', 'census', views.census)
