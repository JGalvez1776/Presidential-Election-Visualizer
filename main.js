// Resets the vizualization
function reset() {
    let right = d3.select("#right");
    let left = d3.select("#left");
    // Remove all children
    right.selectAll("*").remove();
    left.selectAll("*").remove();
}

// Creates a vizualization 
function main(args=null) {
    reset();
    if (args == null) {
        let right = d3.select("#right");
        createMap(right);
        let left = d3.select("#left");
        createMap(left);
        return;
    }
    let type = args["type"];
    if (type == "table") {
        let map = createMap(d3.select("#right"));
        createTable(d3.select("#left"), map);
    }
}

// Set up event listeners for vizualization selection
d3.select("#adjacentView").on("click", function() {
    main();
});
d3.select("#tableView").on("click", function() {
    main({type: "table"});
});
