var z = 9;
var myLL = L.latLng(43.31,2.10);



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

// var offices_layer = 1;


var tourismeaude = L.geoJson( tourismeaude,{
        pointToLayer: function (feature, latlng) {
            var color;
            switch( feature.properties.tourism ){
                case 'camp_site': color= "#0f0";
                case 'hotel': color= "#ff0";
                case '': color= "#ff0";
                default: color= "#ff7800";
            }
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
}).addTo(map); 
var audeContourLayer = L.geoJson( audeContour ).addTo(map); 




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
