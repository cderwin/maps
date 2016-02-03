/*
 * Control extensions -- new controls
 * 
 */

let Controls = {
    init(L){
        for (let control in this){
            if (control != "init"){
                L.Controls[control] = this[control];
            }
        }
    }
}

class Dropdown {

    constructor(id, items, callback){
        this.id = id;
        this.items = items;
        this.head = this.items[0];
        this.callback = callback;
        this.build(items[0]);
    }

    attach(dom_element){
        this.draw();
        if (dom_element){
            $(dom_element).append(this.html);
        }
    }

    draw(head){
        if (head){
            this.head = head;
        }
        this.html = this.build();
        $(`#${this.id}`).replaceWith(this.html);
    }

    build(){
        let head_html = this.get_head();
        let body_html = this.get_body();

        let dropdown = $("<div></div>")
            .attr("id", this.id)
            .addClass("btn-group leaflet-control")
            .append(head_html)
            .append(body_html);

        return dropdown[0];
    }

    get_head(){
        let head = $("<button></button>")
            .addClass("btn btn-default dropdown-toggle")
            .attr("type", "button")
            .attr("data-toggle", "dropdown")
            .attr("aria-haspopup", "true")
            .attr("aria-expanded", "false")
            .html(this.get_head_content(this.head));

        return head[0];
    }

    get_body(){
        let body = $("<ul></ul>").addClass("dropdown-menu dropdown-menu-right");

        this.items.forEach(
            item => {
                body.append(
                    $("<li></li>").append(
                        $('<a href="#"></a>').html(this.get_body_content(item))
                    ).click(() => {
                        this.callback(this, item);
                        this.draw();
                    })
                );
            });

        return body[0];
    }

    get_head_content(head){ return this.get_content(head); }
    get_body_content(item){ return this.get_content(item); }
    get_content(item){ return item; }
}

// PointList control -- to list cities

App.controls.CitiesControl = L.Control.extend({
    options: {
        position: "topright",
        points: {}
    },

    onAdd(map) {
        let points = this.options.points;
        this.dropdown = new Dropdown("cities-control", points,
                (dropdown, point) => {
                    map.panTo(point);
                    dropdown.head = point;
                }
        );

        this.dropdown.get_content = (point => point.name)
        this.dropdown.get_head_content = (point => 'City <i class="fa fa-chevron-down"></i>');
        this.dropdown.draw();

        return this.dropdown.html;
    }
});


// Control to switch between store layers

App.controls.StoresControl = L.Control.extend({
    options: {
        position: "topright",
        store_manager: (new StoreManager())
    },

    onAdd(map){
        this.dropdown = new Dropdown("stores-control", this.options.store_manager.get_types(),
                (dropdown, type) => {
                        this.options.store_manager.switch(type.name);
                }
        );

        this.dropdown.get_content = (type => 
                $('<div></div>')
                .addClass(`checkbox checkbox-${type.name}`)
                .append(
                    $("<input></input>")
                        .attr("type", "checkbox")
                        .attr("id", `control-checkbox-${type.name}`)
                        .attr("checked", type.active || false)
                ).append(
                    $("<label></label>")
                        .attr("for",`control-checkbox-${type.name}`)
                        .text(type.display_name)
                )
        );

        this.dropdown.get_head_content = (() =>
            'Store Type <i class="fa fa-chevron-down"></i>');
        this.dropdown.draw();

        return this.dropdown.html;
    }
});
