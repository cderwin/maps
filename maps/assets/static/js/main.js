var App = {
    config: {
        mapbox_auth: {
            id: 'cderwin.oop9ob0c',
            access_token: 'pk.eyJ1IjoiY2RlcndpbiIsImEiOiJjaWpwOTh2bXUwMTN1dG9rb2g3Y2NmeWJ6In0.WZwqIUtZ4neCjXMT1YOmYw'
        },
        base_url: location.origin
    },
    data: {},
    helpers: {},
    controls: {}
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
    App.controls.citiesList = new L.Control.PointList({points: App.data.cities});
    App.controls.citiesList.addTo(App.data.map);
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

        function build_dropdown (points) {
            var btn_list = $("<ul class=\"dropdown-menu\"></ul>");

            points.forEach(function(point){
                btn_list.append(
                    $("<li></li>").append(
                        $("<a></a>")
                        .attr("href", "#")
                        .text(point.name)
                    ).click(function(){
                        App.data.map.panTo(point);
                        btn_list.parent().children().first().html(point.name + " <span class=\"caret\"></span>");
                    })
                );
            });
            
            return btn_list;
        };

        var container = $("<div></div>")
            .addClass("btn-group")
            .append(
                $("<button></button>")
                .addClass("btn btn-default dropdown-toggle")
                .attr("type", "button")
                .attr("data-toggle", "dropdown")
                .attr("aria-haspopup", "true")
                .attr("aria-expanded", "false")
                .html(points[0].name + " <span class=\"caret\"></span>")
            ).append(build_dropdown(points));
        return container[0];
    }
});
