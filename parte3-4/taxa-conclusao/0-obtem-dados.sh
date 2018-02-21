#!/bin/bash

# Cria um geojson simplificado e quantizado dos municípios da PB + dados do QEDU

# Cria geometria projetada
shp2json UFEBRASIL.shp --encoding 'utf8' \
  | geoproject \
    'd3.geoOrthographic().rotate([54, 14, -2]).fitSize([1000, 600], d)' \
    > geo1-estados.json


# JOIN Geometria, Dado ======================
# organiza geometria
ndjson-split 'd.features' \
  < geo1-estados.json \
  | ndjson-map 'd.Estado = d.properties.NM_ESTADO, d' \
  > geo2-estados.ndjson

# organiza variável
ndjson-map 'd.Estado = d.Estado.toUpperCase(), d' \
  < dado1.ndjson \
  > dado2.ndjson
