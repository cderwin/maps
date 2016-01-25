// PointList control -- to list cities
L.Control.PointList = L.Control.extend({

    options: {
        position: "topright",
        points: {}
    },

    onAdd: function (map) {
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
