var App = {
    config: {
        mapbox_auth: {
            id: 'cderwin.oop9ob0c',
            access_token: 'pk.eyJ1IjoiY2RlcndpbiIsImEiOiJjaWpwOTh2bXUwMTN1dG9rb2g3Y2NmeWJ6In0.WZwqIUtZ4neCjXMT1YOmYw'
        },
        base_url: location.origin
    },
    data: {},
    helpers: {}
};

$.ajax({
    url: App.config.base_url + '/assets/data/cities.json',
    success: function(data){
        App.data.cities = data;
    },
    error: function(){
        App.data.cities = [{
            name: "Austin",
            lat: 30.2500,
            lon: 97.7500
        }]
    },
    complete: function(){
        initialize_map();
        create_cities_menu();
    }
});

initialize_map = function(){
    App.data.map = L.map('container').setView(App.data.cities[0], 13);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: App.config.mapbox_auth.id,
        accessToken: App.config.mapbox_auth.access_token
    }).addTo(App.data.map);
};

create_cities_menu = function(){
};
