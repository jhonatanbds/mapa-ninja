function desenhaSvg(id, color, nomeVariavel, min, max) {
var svg = d3.select(id),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var path = d3.geoPath();

// função aux definida em legenda-d3-cor.js
desenhaLegenda(min, max, color, nomeVariavel)

d3.queue()
    .defer(d3.json, "geo4-municipios-e-aprendizado-simplificado.json")
    .await(ready);

function ready(error, dados) {
  if (error) throw error;

  var cidades = dados.features;

  svg.append("g")
      .attr("class", "cidades")
    .selectAll("path")
    .data(cidades)
    .enter()
    .append("path")
      .attr("fill", d => {valor = d.properties[nomeVariavel]; return valor === "NA" ? '#e0e0eb' : color(valor)})
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
      .text(d.properties.Cidade + ": " + d.properties[nomeVariavel] + "%");
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
}
