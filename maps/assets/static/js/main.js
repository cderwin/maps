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
    var citiesControl = new L.Control.PointList({points: App.data.cities});
    citiesControl.addTo(App.data.map);
    console.log("test");
};


// Custom map controls

// PointList control -- to list cities
L.Control.PointList = L.Control.extend({

    options: {
        position: "topright",
        points: {}
    },

    onAdd: function (map) {
        var points = this.options.points;
        var container = L.DomUtil.create("div", "btn-group"),
            button = L.DomUtil.create("button", "btn btn-default dropdown-toggle", container),
            btn_list = L.DomUtil.create("ul", "dropdown-menu", container);

        button.setAttribute("type", "button");
        button.setAttribute("data-toggle", "dropdown");
        button.setAttribute("aria-haspopup", "true");
        button.setAttribute("aria-expanded", "false");
        button.innerHtml = points[0].name + "<span class=\"caret\"></span>";

        for (var i = 1; i < points.length; i++){
            var point = points[i];
            var item = document.createElement("li");
            item.innerHtml = "<a href=\"#\">" + point.name + "</a>";
            btn_list.appendChild(item);
        }
    }
});
