var vertex_counter = 1;
var edges_counter = 1;
// var g = {
//     nodes: [],
//     edges: []
// };
// g.nodes.push({
//     id: 'n_0',
//     label: 'Node 0',
//     x: Math.random(),
//     y: Math.random(),
//     size: 1,
//     color: '#7b130f'
// });
// s = new sigma({
//     graph: g,
//     container: 'graph-container'
// });


$(document).ready(function () {
    $("input[id$='radio2']").click(function () {
        $("#hand_input").hide();
        $("#csv_input").show();
    });

    $("input[id$='radio1']").click(function () {
        $("#csv_input").hide();
        $("#hand_input").show();
    });

    var i = 1;
    $("#add_vertex").click(function () {
        $('#addr' + i).html("<td>" + (i + 1) + "</td><td><input name='vertex_name_" + i + "' type='text' placeholder='Назва' class='form-control input-md'  /> ");

        $('#table_vertex').append('<tr id="addr' + (i + 1) + '"></tr>');
        i++;
        vertex_counter = i;
        // g.nodes.push({
        //     id: 'n' + i,
        //     label: 'Node ' + i,
        //     x: Math.random(),
        //     y: Math.random(),
        //     size: 1,
        //     color: '#7b130f'
        // });
        // s.kill()
        // s = new sigma({
        //     graph: g,
        //     container: 'graph-container'
        // });
    });
    $("#delete_vertex").click(function () {
        if (i > 1) {
            $("#addr" + (i - 1)).html('');
            i--;
            vertex_counter = i;
        }
    });

});

$(document).ready(function () {
    var i = 1;
    $("#add_edges").click(function () {
        $('#addr_' + i).html("<td>" + (i + 1) + "</td><td><input name='src_" + i + "' type='text' placeholder='Звідки' class='form-control input-md'  /> </td><td><input  name='dest_" + i + "' type='text' placeholder='Куди'  class='form-control input-md'></td><td><input  name='weight_" + i + "' type='text' placeholder='Вага'  class='form-control input-md'></td>");

        $('#table_edges').append('<tr id="addr_' + (i + 1) + '"></tr>');
        i++;
        edges_counter = i;

    });
    $("#delete_edges").click(function () {
        if (i > 1) {
            $("#addr_" + (i - 1)).html('');
            i--;
            edges_counter = i;
        }
    });

});

$(document).ready(function () {
    $("#graph_operate").submit(function (e) {
        e.preventDefault();
    }).validate({
        rules: {
            name: {
                required: true,
                maxlength: 200,
            }
        },
        messages: {
            name: {
                required: "Це поле обов'язкове для заповнення",
                maxlength: "Максимальне число символів - 200",
            },
        },
        submitHandler: function (form) {
            var data = new FormData($('#graph_operate').get(0));
            data.append('vertex_counter', vertex_counter);
            data.append('edges_counter', edges_counter);
            var algorithm = '';
            if (document.getElementById('page_rank').checked) {
                algorithm = "page_rank"
            } else if (document.getElementById('label_propagation').checked) {
                algorithm = "label_propagation"
            }
            var type_input = '';
            if (document.getElementById('radio1').checked) {
                type_input = "hand_input"
            } else if (document.getElementById('radio2').checked) {
                type_input = "csv_input"
            }
            data.append('algorithm', algorithm);
            data.append('type_input', type_input);
            $.ajax({
                url: "/graph/operate/",
                type: "POST",
                data: data,
                cache: false,
                processData: false,
                contentType: false,
                success: function (data) {
                    var vertex = data["vertex"];
                    var algorithm = data["algorithm"];
                    var result = data["result"];
                    var edges = data["edges"];
                    alert(result["a"]);
                    var message_result = "";
                    if (algorithm == 'page_rank') {
                        var v;
                        for (v = 0; v < vertex.length; v++) {
                            message_result += vertex[v];
                            message_result += ': ' + result[vertex[v]] + ', ';
                        }
                    } else if (algorithm == 'label_propagation') {
                        var i;
                        for (i = 0; i < result.length; i++) {
                            message_result += "Спільнота " + (i + 1) + ' :';
                            message_result += result[i];
                        }
                    }
                    $("#container").html('<h3> Зображення графа</h3>\n' +
                        '        <div id="graph-container"></div>'
                    );
                    $("#result").html('<h3>Результат виконання алгоритму:</h3>\n' +
                        message_result
                    );
                    var i,
                        g = {
                            nodes: [],
                            edges: []
                        };
                    // Generate a random graph:
                    for (i = 0; i < vertex.length; i++)
                        g.nodes.push({
                            id: vertex[i],
                            label: vertex[i],
                            x: Math.random(),
                            y: Math.random(),
                            // size: result[keys[i]],
                            size: 2,
                            color: '#142066',
                            labelThreshold: 0.01,
                        });
                    for (i = 0; i < edges.length; i++)
                        g.edges.push({
                            id: 'e' + i,
                            source: edges[i][0],
                            target: edges[i][1],
                            size: 1,
                            color: 'rgba(8,9,10,0.89)',
                            type: 'arrow',
                        });
                    // Instantiate sigma:
                    s = new sigma({
                        graph: g,
                        container: 'graph-container',

                    });
                }
            });
            return false;
        }
    });
});