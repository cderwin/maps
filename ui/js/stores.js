/*
 * Classes for managing store data for various people and displaying said data on the map
 */

class Store {

    constructor(name, lat, lon, type){
        this.name = name;
        this.type = type;
        this.point = L.latLng(lat, lon);
        this.rendered = false;
    }

    get_marker(icon){
        let marker = L.marker(this.point, {
            title: this.name,
            alt: `Store marker: ${this.name}`,
            icon: icon || (new L.Icon.Default())
        }).bindPopup(this.popup_content());

        this.rendered = true;
        return marker;
    }

    popup_content(){
        let element = $('<h6></h6>').text(this.name);
        return element[0];
    }

    static from_payload(type, payload){
        return new this(payload.name, payload.lat, payload.lon, type);
    }
}


class StoreType {
    
    constructor(name, icon){
        this.name = name;
        this.icon = icon;
        this.layer_group = L.layerGroup();
        this.stores = [];
        this.active = false;
    }

    show(map){
        this.active = true;
        this.retrieve_stores(map, () => this.render());
        this.layer_group.addTo(map);

        this.callback = (() => this.retrieve_stores(map, () => this.render()));

        map.on("moveend", this.callback);
    }

    hide(map){
        if (map.hasLayer(this.layer_group)){
            this.active = false;
            map.removeLayer(this.layer_group);
            map.off("moveend", this.callback);
        }
    }

    retrieve_stores(map, callback){
        let center = map.getCenter();

        $.ajax({
            url: `${App.config.base_url}/api/stores/${this.name}/${center.lat}/${center.lng}`,

            success: data => {
                data.results.forEach(
                    store =>
                        this.stores.push(Store.from_payload(this, store))
                );
                
                if (callback){
                    callback();
                }
            },

            error: () =>
                console.log("Could not retrieve stores")
        });
    }

    render(){
        this.stores.filter(
            store => !store.rendered
        ).forEach(
            store => this.layer_group.addLayer(store.get_marker(this.icon))
        );
    }
}


class StoreManager {

    constructor(map, type_data){
        this.map = map;
        this.types = {};

        if (type_data){
            type_data.forEach(
                data => {
                    let type = new StoreType(data.name, data.icon);
                    this.add_type(type);
                }
            );
        }
    }

    add_type(type){ this.types[type.name] = type; }

    show(name){ this.types[name].show(this.map); }

    hide(name){ this.types[name].hide(this.map); }

    update(){
        this.types.filter(
            type => type.active
        ).forEach(
            type => {
                type.retrieve_stores(this.map);
                type.render();
            }
        );
    }

    render(){
        this.types.forEach(
            type => {
                if (type.active){
                    type.show(this.map);
                } else {
                    type.hide(this.map);
                }
            }
        );
    }
}
