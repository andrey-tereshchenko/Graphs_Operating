var vertex_counter = 1;
var edges_counter = 1;

function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV file
    csvFile = new Blob([csv], {type: "text/csv"});

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Hide download link
    downloadLink.style.display = "none";

    // Add the link to DOM
    document.body.appendChild(downloadLink);

    // Click download link
    downloadLink.click();
}

function exportTableToCSV(filename) {
    var csv = [];
    var rows = document.querySelectorAll("#my_table tr");

    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("#my_table td, #my_table th");

        for (var j = 0; j < cols.length; j++)
            row.push(cols[j].innerText);

        csv.push(row.join(","));
    }

    // Download CSV file
    downloadCSV(csv.join("\n"), filename);
}


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
                algorithm = "page_rank";
            } else if (document.getElementById('label_propagation').checked) {
                algorithm = "label_propagation";
            } else if (document.getElementById('triangle_count').checked) {
                algorithm = "triangle_count";
            } else if (document.getElementById('svd').checked) {
                algorithm = "svd";
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
                    // alert(result);
                    var message_result = "";
                    if (algorithm == 'page_rank') {
                        var v;
                        message_result += '<table id="my_table" class="table">\n' +
                            '  <thead>\n' +
                            '    <tr>\n' +
                            '      <th scope="col">#</th>\n' +
                            '      <th scope="col">Page Label</th>\n' +
                            '      <th scope="col">Rank</th>\n' +
                            '    </tr>\n' +
                            '  </thead>' +
                            '<tbody>';
                        for (v = 0; v < vertex.length; v++) {
                            message_result += '<tr>\n' +
                                '      <th scope="row">' + (v + 1) + '</th>\n' +
                                '      <td>' + vertex[v] + '</td>\n' +
                                '      <td>' + result[vertex[v]] + '</td>\n' +
                                '    </tr>'

                        }
                        message_result += '</tbody>\n' +
                            '</table>'
                    } else if (algorithm == 'label_propagation') {
                        var i;
                        message_result += '<table id="my_table" class="table">\n' +
                            '  <thead>\n' +
                            '    <tr>\n' +
                            '      <th scope="col">#</th>\n' +
                            '      <th scope="col">Community</th>\n' +
                            '    </tr>\n' +
                            '  </thead>' +
                            '<tbody>';
                        for (i = 0; i < result.length; i++) {
                            message_result += '<tr>\n' +
                                '      <th scope="row">' + (i + 1) + '</th>\n' +
                                '      <td>' + result[i] + '</td>\n' +
                                '    </tr>'

                        }
                        message_result += '</tbody>\n' +
                            '</table>'
                    } else if (algorithm == 'triangle_count') {
                        message_result += '<table id="my_table" class="table">\n' +
                            '  <thead>\n' +
                            '    <tr>\n' +
                            '      <th scope="col">#</th>\n' +
                            '      <th scope="col">Vertex</th>\n' +
                            '      <th scope="col">Triangle count</th>\n' +
                            '    </tr>\n' +
                            '  </thead>' +
                            '<tbody>';
                        var v;
                        for (v = 0; v < vertex.length; v++) {
                            message_result += '<tr>\n' +
                                '      <th scope="row">' + (v + 1) + '</th>\n' +
                                '      <td>' + vertex[v] + '</td>\n' +
                                '      <td>' + result[vertex[v]] + '</td>\n' +
                                '    </tr>'
                        }
                        message_result += '</tbody>\n' +
                            '</table>'
                    } else if (algorithm == 'svd') {
                        var v;
                        message_result += '<table id="my_table" class="table">\n' +
                            '  <thead>\n' +
                            '    <tr>\n' +
                            '      <th scope="col">#</th>\n' +
                            '      <th scope="col">Source</th>\n' +
                            '      <th scope="col">Destination</th>\n' +
                            '      <th scope="col">Predicted weight</th>\n' +
                            '    </tr>\n' +
                            '  </thead>' +
                            '<tbody>';
                        for (v = 0; v < result.length; v++) {
                            message_result += '<tr>\n' +
                                '      <th scope="row">' + (v + 1) + '</th>\n' +
                                '      <td>' + result[v][0] + '</td>\n' +
                                '      <td>' + result[v][1] + '</td>\n' +
                                '      <td>' + result[v][2] + '</td>\n' +
                                '    </tr>'

                        }
                        message_result += '</tbody>\n' +
                            '</table>'
                    }
                    $("#container").html('<h3> Зображення графа</h3>\n' +
                        '        <div id="graph-container"></div>'
                    );
                    $("#result").html('<h3>Результат виконання алгоритму:</h3>\n' +
                        message_result
                    );
                    $("#save_result").show();
                    var i,
                        g = {
                            nodes: [],
                            edges: []
                        };
                    if (algorithm == 'svd') {
                        var svd_src = data["svd_src"];
                        var svd_dst = data["svd_dst"];
                        // Generate a random graph:
                        var j = 0;
                        for (i = 0; i < svd_src.length; i++) {
                            j++;
                            g.nodes.push({
                                id: svd_src[i],
                                label: svd_src[i],
                                x: 1,
                                y: j * 0.2,
                                // size: result[keys[i]],
                                size: 2,
                                color: '#142066',
                                labelThreshold: 0.01,
                            });
                        }
                        j = 0;
                        for (i = 0; i < svd_dst.length; i++) {
                            j++;
                            g.nodes.push({
                                id: svd_dst[i],
                                label: svd_dst[i],
                                x: 2,
                                y: j * 0.2,
                                // size: result[keys[i]],
                                size: 2,
                                color: '#142066',
                                labelThreshold: 0.01,
                            });
                        }
                    } else {
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
                    }
                    if (algorithm == 'svd' || algorithm == 'triangle_count') {
                        for (i = 0; i < edges.length; i++)
                            g.edges.push({
                                id: 'e' + i,
                                source: edges[i][0],
                                target: edges[i][1],
                                size: 1,
                                color: 'rgba(8,9,10,0.89)',
                                type: 'arrow',
                            });
                    }else {
                        for (i = 0; i < edges.length; i++)
                            g.edges.push({
                                id: 'e' + i,
                                source: edges[i][0],
                                target: edges[i][1],
                                size: 1,
                                color: 'rgba(8,9,10,0.89)',
                                type: 'curvedArrow',
                            });
                    }

                    // Instantiate sigma:
                    s = new sigma({
                        graph: g,
                        container: 'graph-container',
                        settings: {
                            minArrowSize: 5
                        },
                        renderer: {
                            container: document.getElementById('graph-container'),
                            type: sigma.renderers.canvas
                        }

                    });
                    if (algorithm != 'svd') {
                        s.startForceAtlas2({
                            worker: false,
                            barnesHutOptimize: false,
                            slowDown: 1000,
                            iterationsPerRender: 1000
                        });

                        setTimeout(function () {
                            s.stopForceAtlas2();
                        }, 3000)
                    }
                }
            });
            return false;
        }
    });
});