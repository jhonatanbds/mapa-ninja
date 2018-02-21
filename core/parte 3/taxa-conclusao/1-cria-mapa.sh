#!/bin/bash

# o join
# 1. left join (como em SQL)
# 2. o resultado do join é um array com 2 objetos por linha
# 3. o ndjson-map volta a um objeto por linha
EXP_PROPRIEDADE='d[0].properties = Object.assign({}, d[0].properties, d[1]), d[0]'
ndjson-join --left 'd.Estado' \
  geo2-estados.ndjson \
  dado2.ndjson \
  | ndjson-map \
    "$EXP_PROPRIEDADE" \
  > geo3-estados-taxa.ndjson

# SIMPLIFICA E QUANTIZA ======================
geo2topo -n \
  tracts=- \
< geo3-estados-taxa.ndjson \
| toposimplify -p 1 -f \
| topoquantize 1e5 \
| topo2geo tracts=- \
> geo4-estados-taxa-simplificado.json


# a expressão js que decide os fills baseados em uma escala 0, 7000, 14000, 21000, 28000, 35000
# EXP_ESCALA='z = d3.scaleSequential(d3.interpolateViridis).domain([0, 100]),
#             d.features.forEach(f => f.properties.fill = z(f.properties["Percentual Aprendizado Adequado (%)"])),
#             d'
EXP_ESCALA='z = d3.scaleThreshold().domain(d3.range(0, 50, 10)).range(d3.schemeRdBu[5]),
            d.features.forEach(f => f.properties.fill = z(f.properties["Taxa conclusão 2014"])),
            d'

ndjson-map -r d3 -r d3=d3-scale-chromatic \
  "$EXP_ESCALA" \
< geo4-estados-taxa-simplificado.json \
| ndjson-split 'd.features' \
| geo2svg -n --stroke none -w 1000 -h 600 \
  > taxa-choropleth.svg
