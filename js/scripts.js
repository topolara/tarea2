function updateOpacity() {
	document.getElementById("span-opacity").innerHTML = document.getElementById("sld-opacity").value;
	temperaturaLayer.setOpacity(document.getElementById("sld-opacity").value);
}


// Creación de un mapa de Leaflet
var map = L.map("mapid");

// Centro del mapa y nivel de acercamiento
var catedralSJ = L.latLng([9.9326673, -84.0787633]);
var zoomLevel = 7;

// Definición de la vista del mapa
map.setView(catedralSJ, zoomLevel);

// Adición de capa
esriLayer = L.tileLayer.provider("Esri.WorldImagery").addTo(map);
osmLayer = L.tileLayer.provider("OpenStreetMap.Mapnik").addTo(map);
openRailwayLayer = L.tileLayer.provider("OpenRailwayMap").addTo(map);

var distritosWMSLayer = L.tileLayer.wms('http://geos.snitcr.go.cr/be/IGN_5/wms?', {
	layers: 'limitedistrital_5k',
	format: 'image/png',
	transparent: true
}).addTo(map);

var cantonesWMSLayer = L.tileLayer.wms('http://geos.snitcr.go.cr/be/IGN_5/wms?', {
	layers: 'limitecantonal_5k',
	format: 'image/png',
	transparent: true
}).addTo(map);


var temperaturaLayer = L.imageOverlay("1bio1_cr.png", 
	[[11.2197734290000000, -85.9790724540000042], 
	[8.0364413690000003, -82.5540738239999996]], 
	{opacity:1}
).addTo(map);



var baseMaps = {
	"ESRI World Imagery": esriLayer,
	"OpenStreetMap": osmLayer
	
};
var overlayMaps = {
	"Open Railway": openRailwayLayer,
	"Distritos" : distritosWMSLayer,
	"Cantones" : cantonesWMSLayer,
	"Temperatura" :temperaturaLayer
};
control_layers = L.control.layers(baseMaps, overlayMaps, {position:'topleft', collapsed:false} ).addTo(map);

L.control.zoom({position:'topright'} ).addTo(map);
L.control.scale({position:'topright', imperial:false} ).addTo(map);

// Marcador para la Catedral Metropolitana de San José
/* var catedralSJMarker = L.marker([9.9326673, -84.0787633],{draggable:true, opacity:0.5},)
catedralSJMarker.bindPopup('<a href="https://es.wikipedia.org/wiki/Catedral_metropolitana_de_San_Jos%C3%A9">Catedral Metropolitana de San José</a>.<br>Catedral de estilo clásico y barroco. Templo principal de la arquidiócesis católica de San José.<br>Construída entre 1825 y 1827 y reconstruída en 1878.').openPopup();
catedralSJMarker.bindTooltip("Catedral Metropolitana de San José").openTooltip().addTo(map); */


var catedralSJMarker = L.marker([9.9326673, -84.0787633],
	{ icon: L.divIcon(
		{ html: '<i class="fas fa-church"></i>'}
	)}
).addTo(map);



$.getJSON("datos/provincias.geojson", function(geodata) {
	var layer_geojson_provincias = L.geoJson(geodata, {
		style: function(feature) {
			return {'color': "#00ff00", 'weight': 2, 'fillOpacity': 0.0}
		},
		onEachFeature: function(feature, layer) {
			var popupText = "Nombre: " + feature.properties.provincia + "<br>" + "Origen: " + feature.properties.ori_toponi;
			layer.bindPopup(popupText);
		}			
	}).addTo(map);
	control_layers.addOverlay(layer_geojson_provincias, 'Provincias');
});
