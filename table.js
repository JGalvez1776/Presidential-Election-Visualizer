
TABLE_ID = 0;
function getTableId() {
    return TABLE_ID++;
}

class Table {
    constructor(parent, map) {
        this.parent = parent;
        this.map = map;
        this.states = [];
        let id = "table" + getTableId();
        this.table = parent.append("table")
            .attr("class", "table table-striped table-hover table-bordered")
            .attr("id", id)
    }

    draw() {
        // Remove all children
        this.table.selectAll("*").remove();
        if (this.states.length == 0) {
            return;
        }
        let thead = this.table.append("thead");
        let tbody = this.table.append("tbody");
        let header = thead.append("tr");
        header.append("th").text("State");
        for (let year = MIN_YEAR; year <= MAX_YEAR; year += 4) {
            header.append("th").text(year);
        }

        for (let i = 0; i < this.states.length; i++) {
            let state = this.states[i];
            let row = tbody.append("tr");
            let results = getStateResults(state);
            console.log(results);
            row.append("td").text(state.charAt(0).toUpperCase() + state.slice(1).toLowerCase());
            for (let j = 0; j < results.length; j++) {
                let winner = results[j].winner;
                let candidate = getCandidate(results[j], winner);
                let color = getTextColor(winner.charAt(0));
                // Add a cell
                let cell = row.append("td")
                              .text(winner.charAt(0))
                              .style("color", color)
                              .style("font-weight", "bold")
                              .style("text-align", "center")
                              .attr("data-toggle", "tooltip")
                              .attr("data-placement", "top")
                              .attr("title", candidate);

            }

        }
    }

    update(name) {
        if (this.states.includes(name)) {
            this.states = this.states.filter((state) => state != name);
            this.draw();
            return;
        }
        this.states.push(name);
        // Sort states
        this.states.sort();
        this.draw();
    }
}

function getCandidate(data, winner) {
    let candidates = data.candidates;
    // For each candidate
    for (const [key, value] of Object.entries(candidates)) {
        if (value.party == winner) {
            let split = key.split(",");
            return split[1] + " " + split[0];

        }
    }
    return "N/A";
        
}

function getTextColor(winner) {
    if (winner == "R") {
        return "red";
    } else if (winner == "D") {
        return "blue";
    } else {
        return "gray";
    }
}