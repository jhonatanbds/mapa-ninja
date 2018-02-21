
var svg = d3.select("svg"),
width = +svg.attr("width"),
height = +svg.attr("height");

var path = d3.geoPath();

// a escala de cores
var color = d3.scaleThreshold()
  .domain(d3.range(-30, 51, 20))
  .range(d3.schemeRdYlBu[5]);

// função aux definida em legenda-d3-cor.js
desenhaLegenda(-50, 50, color, "Crescimento entre 2011 e 2013 (pp*)")

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
  .attr("fill", d => {let valor = d.properties["Crescimento entre 2011 e 2013 (pp*)"]; return valor === "NA" ? '#e0e0eb' : color(valor)})
  .attr("d", path)
.append("title")
  .text(d => d.properties.Cidade + ": " + d.properties["Crescimento entre 2011 e 2013 (pp*)"] + "%");
}
