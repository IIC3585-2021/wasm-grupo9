// Create a new directed graph
export const g = new dagreD3.graphlib.Graph().setGraph({});

// States and transitions from RFC 793
export const states = ["A", "B", "C", "D",
              "E", "F", "G", "H",
              "I", "J", "K", "L",
              "M", "N", "O", "P",
              "Q", "R", "S", "T",
              "U", "V", "W", "X",
              "Y", "Z"];

const statesDict = {}
states.forEach((state, index) => { statesDict[index] = state });

export const createNodes = (states, nStates) => {
    states.forEach( (state, index) => { index < nStates ? g.setNode(state, { label: state }): {} });
}

export const createLabels = (matrix, g) => {
    matrix.forEach((row, rowIndex) => {
        row.forEach( (weight, colIndex) => {
            weight != "" ? g.setEdge(statesDict[rowIndex], statesDict[colIndex],     { label: `${weight}` }): {};
        })
    })
}

// Generamos los nodos en el gráfico


 // Esta debería venir del html!
//const matrix = [["", 2, 3], [2, "", 4], [3, 4, ""]];

// Generamos los labels de las conexiones entre nodos en el gráfico



// Set some general styles
export const giveStyle = () => {
    g.nodes().forEach(function(v) {
        let node = g.node(v);
        console.log(v);
        node.rx = node.ry = 5;
        /* node.style = "fill: #7f7"; */
      });
}


// Va coloreando con verde las ciudades en orden segun el resultado
export const showPath = (citiesPath) => {
    citiesPath = citiesPath.map(c => {return statesDict[c - 1]})
    console.log(citiesPath)
    citiesPath.forEach((city, index) => {
        setTimeout(() => {
            let node = g.node(city);
            node.style = "fill: #7f7";
            renderGraph();
        }, (index + 1) * 600)
    })
}



export const renderGraph = () => {
    const svg = d3.select("svg");
    const inner = svg.select("g");

    // Set up zoom support
    const zoom = d3.zoom().on("zoom", function() {
        inner.attr("transform", d3.event.transform);
        });
    svg.call(zoom);

    // Create the renderer
    const render = new dagreD3.render();

    // Run the renderer. This is what draws the final graph.
    render(inner, g);

    // Center the graph
    const initialScale = 0.75;
    svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr("width") - g.graph().width * initialScale) / 2, 20).scale(initialScale));

    svg.attr('height', g.graph().height * initialScale + 40);
}

