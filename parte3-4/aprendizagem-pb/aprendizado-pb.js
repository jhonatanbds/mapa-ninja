var aprendizado = function() {
    
    var svg = d3.select("#aprendizado"),
        width = +svg.attr("width"),
        height = +svg.attr("height");
    svg.selectAll("*").remove();
    var path = d3.geoPath();

    // a escala de cores
    var color = d3.scaleThreshold()
        .domain(d3.range(0, 81, 20))
        .range(d3.schemeYlGnBu[5]);

    // função aux definida em legenda-d3-cor.js
    var min = 0
    var max = 80

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
      .text("Percentual Aprendizado Adequado (%)");

  g.call(d3.axisBottom(x)
      .tickSize(13)
      .tickFormat(function(x, i) { return (i ? x : x + "%"); })
      .tickValues(color.domain()))
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
        .attr("fill", d => {valor = d.properties["Percentual Aprendizado Adequado (%)"]; return valor === "NA" ? '#e0e0eb' : color(valor)})
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
        .text(d.properties.Cidade + ": " + d.properties["Percentual Aprendizado Adequado (%)"] + "%");
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