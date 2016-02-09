class City {

    constructor(city_name, coords){
        this.name = city_name;
        this.coords = coords;
        this.layer = omnivore.topojson(`/assets/data/${city_name}.topojson`);
        this.active = false;
    }

    show_tracts(map){
        this.layer.addTo(map);
    }

    hide_tracts(map){}

    pan_to(map){
        map.panTo(this.coords);
    }

    static from_payload(payload){
        return new this(
            payload.name,
            {
                lat: payload.lat,
                lon: payload.lon
            }
        );
    }
}


class CitiesManager {

    constructor(map, cities){
        this.map = map;
        this.cities = cities;
        this.activate(this.cities[0]);
    }

    activate(city_name){
        for (let city of this.cities){
            if (city.name == city_name){
                city.active = true;
                city.pan_to(thiis.map);
                city.show_tracts(this.map);
            } else {
                city.active = false;
            }
        }
    }

    deactivate(city_name){
        for (let city of this,cities){
            if (city.name == city_name && city.active){
                city.hide_tracts(this.map);
                city.active = false;
            }
        }
    }
}
