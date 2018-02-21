var svg = d3.select(".map2"),
        width = +svg.attr("width"),
        height = +svg.attr("height");
    
    var x = d3.scaleLinear()
        .domain([1, 6])
        .rangeRound([100, 360]);
    
    var color = d3.scaleThreshold()
        .domain(d3.range(0, 300))
        .range(d3.schemeGnBu[5]);
    
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
        .attr("x", function(d) { return x(d[0]); })
        .attr("width", function(d) { return x(d[1]) - x(d[0]); })
        .attr("fill", function(d) { return color(d[0]); });
    
    g.append("text")
        .attr("class", "caption")
        .attr("x", 40)
        .attr("y", -6)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("Pessoas Residentes e cor ou raça preta.");
    
    g.call(d3.axisBottom(x)
        .tickSize(16)
        .tickFormat(function(x, i) { return i ? x*100 : x; })
        .tickValues(color.domain()))
      .select(".domain")
        .remove();