// Config

let App = {
    config: {
        mapbox_auth: {
            id: 'cderwin.oop9ob0c',
            access_token: 'pk.eyJ1IjoiY2RlcndpbiIsImEiOiJjaWpwOTh2bXUwMTN1dG9rb2g3Y2NmeWJ6In0.WZwqIUtZ4neCjXMT1YOmYw'
        },
        base_url: location.origin,
        images_path: '/assets/images'
    },
    data: {
        cities: [{
            name: "Austin",
            lat: 30.2500,
            lon: -97.7500
        }],
        stores: [
            {
                name: "verizon",
                icon: (new L.AwesomeMarkers.icon({
                            markerColor: "red",
                            prefix: "fa",
                            icon: "mobile"
                }))
            },
            {
                name: "att",
                icon: (new L.AwesomeMarkers.icon({
                            markerColor: "blue",
                            prefix: "fa",
                            icon: "mobile"
                }))
            },
            {
                name: "tmobile",
                icon: (new L.AwesomeMarkers.icon({
                            markerColor: "pink",
                            prefix: "fa",
                            icon: "mmobile"
                }))
            },
            {
                name: "sprint",
                icon: (new L.AwesomeMarkers.icon({
                            markerColor: "yellow",
                            prefix: "fa",
                            icon: "mobile"
                }))
            }
        ]
    },
    managers: {},
    controls: {
        registry: {}
    }
};

L.Icon.Default.imagePath = App.config.base_url + App.config.images_path;


// Initialization

function init(){
    initMap();
    initCities();
    initStores();
};


function initMap(){
    let mapbox_layer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
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
        url: `${App.config.base_url}/assets/data/cities.json`,
        success: data => {
            App.data.cities = data
        },
        error: () => (
            console.log("Could not load cities from server")
        ),
        complete: () => {
            // Set up cities control
            let citiesControl = App.controls.registry.cities = new App.controls.CitiesControl({points: App.data.cities});
            citiesControl.addTo(App.data.map);
            App.data.map.panTo(App.data.cities[0]);
        }
    });
};


function initStores(){
    App.managers.StoreManager = new StoreManager(App.data.map, App.data.stores);
    App.managers.StoreManager.show("verizon");
};


// Run it

$(document).ready(
    () => init()
);
