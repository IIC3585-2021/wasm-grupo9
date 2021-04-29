// Create a new directed graph
var g = new dagreD3.graphlib.Graph().setGraph({});

// States and transitions from RFC 793
var states = ["A", "B", "C", "D",
              "E", "F", "G", "H",
              "I", "J", "K"];

// Automatically label each of the nodes
states.forEach(function(state) { g.setNode(state, { label: state }); });

// Set up the edges
g.setEdge("A",     "B",     { label: "12" });
g.setEdge("B",     "C",     { label: "4" });
g.setEdge("C",     "D",     { label: "5" });
g.setEdge("D",     "E",     { label: "7" });
g.setEdge("E",     "F",     { label: "1" });
/* g.setEdge("SYN RCVD",   "ESTAB",      { label: "rcv ACK of SYN" });
g.setEdge("SYN SENT",   "SYN RCVD",   { label: "rcv SYN" });
g.setEdge("SYN SENT",   "ESTAB",      { label: "rcv SYN, ACK" });
g.setEdge("SYN SENT",   "CLOSED",     { label: "close" });
g.setEdge("ESTAB",      "FINWAIT-1",  { label: "close" });
g.setEdge("ESTAB",      "CLOSE WAIT", { label: "rcv FIN" });
g.setEdge("FINWAIT-1",  "FINWAIT-2",  { label: "rcv ACK of FIN" });
g.setEdge("FINWAIT-1",  "CLOSING",    { label: "rcv FIN" });
g.setEdge("CLOSE WAIT", "LAST-ACK",   { label: "close" });
g.setEdge("FINWAIT-2",  "TIME WAIT",  { label: "rcv FIN" });
g.setEdge("CLOSING",    "TIME WAIT",  { label: "rcv ACK of FIN" });
g.setEdge("LAST-ACK",   "CLOSED",     { label: "rcv ACK of FIN" });
g.setEdge("TIME WAIT",  "CLOSED",     { label: "timeout=2MSL" }); */

// Set some general styles
g.nodes().forEach(function(v) {
  var node = g.node(v);
  node.rx = node.ry = 5;
});

// Add some custom colors based on state
g.node('A').style = "fill: #f77";
g.node('B').style = "fill: #7f7";

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