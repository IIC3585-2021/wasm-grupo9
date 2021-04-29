// Create a new directed graph
const g = new dagreD3.graphlib.Graph().setGraph({});

// States and transitions from RFC 793
const states = ["A", "B", "C", "D",
              "E", "F", "G", "H",
              "I", "J", "K", "L",
              "M", "N", "O", "P",
              "Q", "R", "S", "T",
              "U", "V", "W", "X",
              "Y", "Z"];

const statesDict = {}
states.forEach((state, index) => { statesDict[index] = state });

const createNodes = (states, nStates) => {
    states.forEach( (state, index) => { index < nStates ? g.setNode(state, { label: state }): {} });
}

const createLabels = (matrix, g) => {
    matrix.forEach((row, rowIndex) => {
        row.forEach( (weight, colIndex) => {
            weight != "" ? g.setEdge(statesDict[rowIndex], statesDict[colIndex],     { label: `${weight}` }): {};
        })
    })
}

// Generamos los nodos en el gráfico
createNodes(states, 3);

 // Esta debería venir del html!
const matrix = [["", 2, 3], [2, "", 4], [3, 4, ""]];

// Generamos los labels de las conexiones entre nodos en el gráfico
createLabels(matrix, g);


// Set some general styles
g.nodes().forEach(function(v) {
  var node = g.node(v);
  node.rx = node.ry = 5;
  node.style = "fill: #7f7";
});



var svg = d3.select("svg"),
    inner = svg.select("g");

// Set up zoom support
var zoom = d3.zoom().on("zoom", function() {
      inner.attr("transform", d3.event.transform);
    });
svg.call(zoom);

// Create the renderer
var render = new dagreD3.render();

// Run the renderer. This is what draws the final graph.
render(inner, g);

// Center the graph
var initialScale = 0.75;
svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr("width") - g.graph().width * initialScale) / 2, 20).scale(initialScale));

svg.attr('height', g.graph().height * initialScale + 40);