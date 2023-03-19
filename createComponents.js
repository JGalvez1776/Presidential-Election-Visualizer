VIS_HEIGHT = "700px";


function createComponent(id) {
    selector = "#" + id;
    var parent = d3.select(selector);
    var width = parent.node().getBoundingClientRect().width;
    var height = parent.node().getBoundingClientRect().height;
    if (id == "election-map") {
        createMap(parent, width, VIS_HEIGHT);
    } else if (id == "election-table") {
        createTable(parent);
    }
}


function createMap(parent, width, height) {

    parent.append("svg")
        .attr("width", width)
        .attr("height", height);

}

function createTable(parent) {

}