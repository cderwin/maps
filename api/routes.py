import views

def wire(app):
    app.add_url_rule('/', 'index', views.index)
    app.add_url_rule('/api/stores/<provider>/<lat>/<lon>', 'stores', views.stores)
    # app.add_url_rule('/api/census/<category>', 'census', views.census)
