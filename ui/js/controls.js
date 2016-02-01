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

// PointList control -- to list cities

App.controls.CitiesControl = L.Control.extend({
    options: {
        position: "topright",
        points: {}
    },

    onAdd(map) {
        let points = this.options.points;

        function build_dropdown (points) {
            let btn_list = $("<ul></ul>").addClass("dropdown-menu dropdown-menu-right");

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

        let container = $("<div></div>")
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


// Control to switch between store layers

App.controls.StoresControl = L.Control.extend({

});
