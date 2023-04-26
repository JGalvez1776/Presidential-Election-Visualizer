

let PROPERTIES = "properties";
let NAME = "NAME";
let STATES = "states";
let WINNER = "winner";

let mapId = 0;
function getMapId() {
    mapId++;
    return mapId;
}

class Map {
    constructor(svg, data) {
        this.svg = svg;
        this.data = data;
        this.init_map();
    }

    getSvg() {
        return this.svg;
    }

    getHeight() { 
        return +this.svg.attr("height");
    }

    getWidth() {
        return +this.svg.attr("width");
    }

    fillColor(d) {
        return "grey";
    }

    strokeColor(_) {
        return "white";
    }

    strokeWidth(_) {
        return 2;
    }

    opacity(_) {
        return 1;
    }

    onClick(_) {}

    init_map() {
        let projection = d3.geoAlbersUsa()
            .translate([this.getWidth() / 2, this.getHeight() / 2])
            .scale([1000]);
        let path = d3.geoPath()
            .projection(projection);
        this.svg.selectAll("path")
            .data(USA_GEO_DATA.features)
            .enter()
            .append("path")
            .style("fill", d => fillWrapper(this.fillColor, d, this.data))
            .style("stroke", d => this.strokeColor(d))
            .style("opacity", d => this.opacity(d))
            .style("stroke-width", d => this.strokeWidth(d))
            .style("cursor", "pointer")
            .on("click", d => this.onClick(d))
            .attr("class", "state")
            .attr("name", d => d[PROPERTIES][NAME])
            .attr("selected", false)
            .attr("d", path);

    }


}

function fillWrapper(f, d, self) {
    return f(d, self);
}

let TRANSITION_TIME = 500;

// Extend the Map class to fit an election
class ElectionMap extends Map {
    constructor(svg, year) {
        super(svg, ElectionMap.getData(year));
        this.data = ElectionMap.getData(year);
        this.year = year;
        this.selected = new Set();
        this.listeners = [];

        
    }

    static getData(year) {
        return PRESIDENT_DATA["years"][year];
    }

    addListener(listener) {
        this.listeners.push(listener);
    }

    setYear(year) {
        this.year = year;
        this.data = ElectionMap.getData(year);
        this.update_map();
    }

    update_map() {
        this.svg.selectAll(".state")
            .transition()
            .duration(TRANSITION_TIME)
            .style("fill", d => this.fillColor(d, this.data))
            .style("stroke", d => this.strokeColor(d))
            .style("opacity", d => this.opacity(d))
            .style("stroke-width", d => this.strokeWidth(d))
    }

    // Override the fillColor method
    fillColor(d, data) {
        let name = d[PROPERTIES][NAME].toUpperCase();
        let states = data[STATES];
        
        let election = states[name];
        if (election != undefined) {
            let winner = election[WINNER];
            if (winner == "DEMOCRAT") {
                return "blue";
            } else if (winner == "REPUBLICAN") {
                return "red";
            } else {
                return "green";
            }
        }
        return super.fillColor(d);
    }



    // Override opacity
    opacity(d) {
        if (this.selected === undefined || this.selected.size == 0) {
            return 1;
        }
        let name = d[PROPERTIES][NAME].toUpperCase();
        if (this.selected.has(name)) {
            return 1;
        }
        return 0.25;
    }

    // Override onClick
    onClick(d) {
        let name = d[PROPERTIES][NAME].toUpperCase();
        // If in selected remove otherwise add
        if (this.selected.has(name)) {
            this.selected.delete(name);
        } else {
            this.selected.add(name);
        }
        this.update_map();
        for (let listener of this.listeners) {
            listener.update(name);
        }

    }

}

