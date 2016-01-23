from api.views import stores, census

def wire(app):
    app.add_url_rule('/api/stores/<provider>', 'stores', stores.dispatch)
    app.add_url_rule('/api/census/<category>', 'census', census.dispatch)
