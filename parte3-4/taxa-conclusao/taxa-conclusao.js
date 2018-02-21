var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var path = d3.geoPath();

// a escala de cores
var color = d3.scaleThreshold()
    .domain(d3.range(30, 61, 10))
    .range(d3.schemeRdBu[5]);

// função aux definida em legenda-d3-cor.js
desenhaLegenda(20, 70, color, "Taxa conclusão 2014")

d3.queue()
    .defer(d3.json, "geo4-estados-taxa-simplificado.json")
    .await(ready);

function ready(error, dados) {
  if (error) throw error;

  var estados = dados.features;

  svg.append("g")
      .attr("class", "Estado")
    .selectAll("path")
    .data(estados)
    .enter()
    .append("path")
      .attr("fill", d => {valor = d.properties["Taxa conclusão 2014"]; return valor === "NA" ? '#e0e0eb' : color(valor)})
      .attr("d", path)
      .on("mouseover",showTooltip)
      .on("mousemove",moveTooltip)
      .on("mouseout",hideTooltip)
}

// ZOOM

//create zoom handler
var zoom_handler = d3.zoom()
    .on("zoom", zoom_actions);

//specify what to do when zoom event listener is triggered
function zoom_actions(){
 d3.selectAll("path").attr("transform", d3.event.transform);
}

//add zoom behaviour to the svg element
//same as svg.call(zoom_handler);
zoom_handler(svg);


// TOOLTIP

//Create a tooltip, hidden at the start
var tooltip = d3.select("body").append("div").attr("class","tooltip");
//Position of the tooltip relative to the cursor
var tooltipOffset = {x: 5, y: -25};

function showTooltip(d) {
  moveTooltip();

  tooltip.style("display","block")
      .text(d.properties.Estado + ": " + d.properties["Taxa conclusão 2014"] + "%");
}

//Move the tooltip to track the mouse
function moveTooltip() {
  tooltip.style("top",(d3.event.pageY+tooltipOffset.y)+"px")
      .style("left",(d3.event.pageX+tooltipOffset.x)+"px");
}

//Create a tooltip, hidden at the start
function hideTooltip() {
  tooltip.style("display","none");
}
