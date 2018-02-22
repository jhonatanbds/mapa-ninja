var crescimento = function() {
  var svg = d3.select("#crescimento"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

  svg.selectAll("*").remove();
  var path = d3.geoPath();

  // a escala de cores
  var color = d3.scaleThreshold()
    .domain(d3.range(-30, 51, 20))
    .range(d3.schemeRdYlBu[5]);

  var min = -50
  var max = 50
  var nomeVariavel = "Crescimento entre 2011 e 2013 (pp*)"
  var x = d3.scaleLinear()
        .domain([min, max])
        .rangeRound([600, 860]);
  
    var g = svg.append("g")
        .attr("class", "key")
        .attr("transform", "translate(0,40)");
  
    g.selectAll("rect")
      .data(color.range().map(function(d) {
          d = color.invertExtent(d);
          if (d[0] == null) d[0] = x.domain()[0];
          if (d[1] == null) d[1] = x.domain()[1];
          return d;
        }))
      .enter().append("rect")
        .attr("height", 8)
        .attr("x", d => x(d[0]))
        .attr("width", function(d) { return x(d[1]) - x(d[0]); })
        .attr("fill", function(d) { return color(d[0]); });
  
    g.append("text")
        .attr("class", "caption")
        .attr("x", x.range()[0])
        .attr("y", -6)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(nomeVariavel);
  
    g.call(d3.axisBottom(x)
        .tickSize(13)
        .tickFormat(function(x, i) { return (i ? x : x + "%"); })
        .tickValues(color.domain().concat(min)))
      .select(".domain")
        .remove();

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
        .text(d.properties.Cidade + ": " + d.properties["Crescimento entre 2011 e 2013 (pp*)"] + "%");
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