// Config

var App = {
    config: {
        mapbox_auth: {
            id: 'cderwin.oop9ob0c',
            access_token: 'pk.eyJ1IjoiY2RlcndpbiIsImEiOiJjaWpwOTh2bXUwMTN1dG9rb2g3Y2NmeWJ6In0.WZwqIUtZ4neCjXMT1YOmYw'
        },
        base_url: location.origin
    },
    data: {
        cities: [{
            name: "Austin",
            lat: 30.2500,
            lon: -97.7500
        }],
        stores: []
    },
    managers: {},
    controls: {
        registry: {}
    }
};

L.Icon.Default.imagePath = App.config.base_url + "/assets/vendor/images";


// Initialization

function init(){
    initMap();
    initCities();
    initStores();
};


function initMap(){
    var mapbox_layer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        maxZoom: 18,
        id: App.config.mapbox_auth.id,
        accessToken: App.config.mapbox_auth.access_token
    });

    App.data.map = new L.map('container', {
        center: App.data.cities[0],
        zoom: 13,
        layers: [mapbox_layer],
        maxBounds: L.latLngBounds([49.3457868, -124.7844079], [24.7433195, -66.9513812])
    });
};


function initCities(){
    $.ajax({
        url: App.config.base_url + '/assets/data/cities.json',
        success: function(data){
            App.data.cities = data;
        },
        error: function(){
            console.log("Could not load cities from server");
        },
        complete: function(){
            // Set up cities control
            var citiesControl = App.controls.registry.cities = new App.controls.CitiesControl({points: App.data.cities});
            citiesControl.addTo(App.data.map);
            App.data.map.panTo(App.data.cities[0]);
        }
    });
};


function initStores(){
    App.managers.StoreManager.loadFromCenter("verizon");
    App.data.map.on("moveend", function(){
        App.managers.StoreManager.loadFromCenter("verizon");
    });
};


// Store manager

App.managers.StoreManager = {
    load: function (type, lat, lon){
        $.ajax({
            url: App.config.base_url + "/api/stores/" + type + "/" + lat + "/" + lon,
            success: function(data){
                data.results.forEach(function(store){
                    if (App.data.stores.indexOf(store) == -1){
                        App.data.stores.push(store);
                    }
                });
                App.managers.StoreManager.update();
            },
            error: function(){
                console.log("Stores could not be loaded form ${App.config.base_url}");
            }
        });
    },

    update: function (){
        var bounds = App.data.map.getBounds();

        App.data.stores.filter(
            function(store){
                return bounds.contains(L.latLng(store.lat, store.lon)) && (!store.rendered);
            }
        ).forEach(function(store){
            L.marker(store, {title: store.name, alt: "Store marker: ${store.name}"})
                .addTo(App.data.map)
                .bindPopup(App.managers.StoreManager.popupContent(store));
            store.rendered = true;
        });
    },

    loadFromCenter: function(type){
        var center = App.data.map.getCenter();
        this.load(type, center.lat, center.lng);
    },

    popupContent: function (store){
        var element = $('<h6></h6>').text(store.name);
        return element[0];
    }
};


// Control extensions -- new controls

// PointList control -- to list cities
App.controls.CitiesControl = L.Control.extend({
    options: {
        position: "topright",
        points: {}
    },

    onAdd(map) {
        var points = this.options.points;

        function build_dropdown (points) {
            var btn_list = $("<ul></ul>").addClass("dropdown-menu dropdown-menu-right");

            points.forEach(function(point){
                btn_list.append(
                    $("<li></li>").append(
                        $("<a></a>")
                        .attr("href", "#")
                        .text(point.name)
                    ).click(function(){
                        map.panTo(point);
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


// Run it

$(document).ready(function(){
    init();
});
