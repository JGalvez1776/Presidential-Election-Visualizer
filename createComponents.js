VIS_HEIGHT = 700;

MAPS = [];

const SLIDER_STRING = "Election Year: "

// Creates a map at a given parent element returns the ElectionMap object
function createMap(parent, args) {
    let width = parent.node().getBoundingClientRect().width;
    let height = -1;
    if (args == null) {
        height = window.innerHeight * 0.8;
    } else {
        height = args["height"];
    }
    let map = createMapHelper(parent, width, height);
    parent.style("height", height + "px");
    parent.style("width", width + "px");
    return map;
}

// Helper function for createMap
function createMapHelper(parent, width, height) {
    let year = "2020"
    // Create an svg element
    let svg = parent.append("svg")
    // Add a slider
    let id = "map" + getMapId();

    svg.attr("width", width)
        .attr("height", height)
        .attr("class", "map")
        .attr("id", id)
    let map = new ElectionMap(svg, year); 

    // Create input group
    let inputGroup = parent.append("div")
        .attr("class", "input-group")
        .attr("id", "input-group" + MAPS.length)
    
    // Add inputGroup to top middle
    inputGroup.style("position", "absolute")
        .style("top", "0px")

    let label = inputGroup.append("label")
        .attr("class", "form-label")
        .attr("for", "mapRange" + id)
        .text(SLIDER_STRING + year)
    inputGroup.append("br")

    // Add a slider
    let slider = inputGroup.append("input")
        .attr("type", "range")
        .attr("class", "form-range")
        .attr("min", MIN_YEAR)
        .attr("max", MAX_YEAR)
        .attr("step", "4")
        .attr("id", "mapRange" + id)
        .attr("value", MAX_YEAR)

    slider.on("input", function() {
        let value = this.value;
        label.text(SLIDER_STRING + value);
        map.setYear(value);
    });

    createLegend(parent);

    return map;


}

// Helper function for createMap
function createLegend(parent) {
    // Add a legend to bottom right corner
    let legend = parent.append("div")
        .attr("class", "legend")
        .style("position", "absolute")
        .style("bottom", "25px")
        .style("right", "25px")
        .style("background-color", "white")
        .style("border", "1px solid black")
        .style("padding", "10px")
    
    legend.append("text")
        .text("Legend")
        .style("font-weight", "bold")
        .append("br")
    
    legend.append("text")
        .text("D - Democrat")
        .style("color", "blue")
        .append("br")

    legend.append("text")
        .text("R - Republican")
        .style("color", "red")
        .append("br")
}

// Creates a table at a given parent element given an ElectionMap
function createTable(parent, map) {
    let table = new Table(parent, map);
    map.addListener(table);
    return table;
}