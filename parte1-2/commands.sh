ndjson-map \
  "$EXP_PROPRIEDADE" \
  < join.ndjson \
  | geo2topo -n \
    tracts=- \
  | toposimplify -p 1 -f \
  | topoquantize 1e5 \
  | topo2geo tracts=- \
  | ndjson-map -r d3 -r d3=d3-scale-chromatic \
    "$EXP_ESCALA" \
  | ndjson-split 'd.features' \
  | geo2svg -n --stroke none -w 1000 -h 600 \
> pb-chroropleth.svg