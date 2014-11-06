var z = 10;
var myLL = L.latLng(43.03,2.48);
var defaultColor="#ff7800";



// create a map in the "map" div, set the view to a given place and zoom
var map = L.map('map', {
    center: myLL,
    zoom: z
});


// add an OpenStreetMap tile layer
var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: 'OpenStreetMap'
}).addTo(map);

var esriLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var mapqLayer = L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
    attribution: 'MapQuest OpenStreetMap',
    subdomains: ['otile1', 'otile2', 'otile3', 'otile4']
});

var featureTypes = {
'camp_site': {color: '#0f0'},
'hotel': {color: '#ff0'},
'information': {color: '#0ff'},
'picnic_site': {color: '#f0f'},
'attraction': {color: '#B45F04'},
'chalet': {color: '#DF013A'},
'guest_house': {color: '#A901DB'},
'viewpoint': {color: '#3A01DF'},
'museum': {color: '#0174DF'},
'artwork': {color: '#D7DF01'}
};


function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    var popupcontent="default";
    if (feature.properties){
        if ( feature.properties.name) {
            popupcontent="name: "+feature.properties.name+"</br>";
        }
        if ( feature.properties.tourism){
            popupcontent+="tourism: "+feature.properties.tourism;
        }
    }
    layer.bindPopup(popupcontent);
}

function colorizeFeature(feature, latlng) {

    var tourismVal = feature.properties.tourism;

    var color = featureTypes[tourismVal] ? featureTypes[tourismVal].color: defaultColor;
    var geojsonMarkerOptions = {
            radius: 8,
            fillColor: color,
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
    return L.circleMarker(latlng, geojsonMarkerOptions);
}

function filterizeFeature(feature, layer){
    return true;
}

var tourismeaude = L.geoJson( tourismeaude,{
    onEachFeature: onEachFeature,
    pointToLayer: colorizeFeature, 
    filter: filterizeFeature,
}).addTo(map); 

var audeContourLayer = L.geoJson( audeContour, {
    smoothFactor: "5",
    style: {
    "opacity":"1",
    "stroke-width": "5",
    "stroke": "blue",
    }
}).addTo(map); 




var baseLayers = {
    "Satellite": esriLayer,
    "OSM": osmLayer,
    "MapBox": mapqLayer,
};

//
var overLays = {
//    "Offices Du Tourisme": offices_layer,
    "Aude (dpt)": audeContourLayer,
    "Tourisme": tourismeaude 
};

// Layers switchers
L.control.layers(baseLayers, overLays).setPosition('topright').addTo(map);
//L.control.layers(baseLayers).setPosition('topright').addTo(map);

// Scale at bottom left
L.control.scale().addTo(map);

// Rewrite url to show lat/lon/zoom
// (uses leaflet-hash plugin as submodule)
// var hash = new L.Hash(map);

// search field to find place
// (use leaflet-geocoding plugin as submodule)
// new L.Control.GeoSearch({
//     provider: new L.GeoSearch.Provider.OpenStreetMap(),
//     zoomLevel: 15,
// }).addTo(map);
