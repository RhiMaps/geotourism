var z = 10;
var myLL = L.latLng(43.03,2.48);
var defaultColor="#ff7800";
var defaultIcon="default";
var selectedType="information";
var selectedLayers = [];
var mapLayerGroups = [];

var featureTypes = {
    'camp_site': {color: '#0f0'},
    'caravan_site': {color: '#0f0'},
    'hotel': {color: '#ff0'},
    'motel': {color: '#ff0'},
    'hostel': {color: '#ff0'},
    'information': {color: '#0ff'},
    'picnic_site': {color: '#f0f'},
    'attraction': {color: '#B45F04'},
    'zoo': {color: '#B45F04'},
    'chalet': {color: '#DF013A'},
    'guest_house': {color: '#A901DB'},
    'bed_and_breakfast': {color: '#A901DB'},
    'viewpoint': {color: '#3A01DF'},
    'museum': {color: '#0174DF'},
    'artwork': {color: '#D7DF01'}
};

function type2iconpath( type ){
    return "data/icons/"+type+".png";
}


// dynamically fill toolbar
// TODO: get rid of featureTypes an use mapLayerGroups
// instead
for(var key in featureTypes ) {
    var img = $('<img id="'+key+'" src="'+type2iconpath(key)+'"></li>');
    img.click(function(){ toggleLayer( $(this).attr("id") ); $(this).toggleClass("shade")});
    var li = $("<li></li>");
    li.append( img );
    $("#toolbar").append(li);
}


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

function onEachHistoric(feature, featureLayer) {
    // create popup at click on feature
    var popupcontent="";
    if (feature.properties){
        if ( feature.properties.name) {
            popupcontent="name: "+feature.properties.name+"</br>";
        }
        if ( feature.properties.tourism){
            popupcontent+="historic: "+feature.properties.historic;
        }
    }
    featureLayer.bindPopup(popupcontent);


}

function onEachFeature(feature, featureLayer) {
    // create popup at click on feature
    var popupcontent="";
    if (feature.properties){
        if ( feature.properties.name) {
            popupcontent="name: "+feature.properties.name+"</br>";
        }
        if ( feature.properties.tourism){
            popupcontent+="tourism: "+feature.properties.tourism;
        }
    }
    featureLayer.bindPopup(popupcontent);

    // now add to layer group based on type
    // ( from http://stackoverflow.com/questions/16148598/leaflet-update-geojson-filter )
    //

    // does layerGroup already exist? if not create it and add to map
    var lg = mapLayerGroups[feature.properties.tourism];

    if (lg === undefined) {
        lg = new L.layerGroup();
        //add the layer to the map
        lg.addTo(map);
        //store layer
        mapLayerGroups[feature.properties.tourism] = lg;
    }

    //add the feature to the layer
    lg.addLayer(featureLayer);
    // add type to selected
    selectedLayers[feature.properties.tourism]=1;
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

function iconifyFeature( feature, latlng) {
    var tourismVal = feature.properties.tourism;

    var iconName = featureTypes[tourismVal] ? tourismVal: defaultIcon;
    var iconPath = 'data/icons/'+iconName+'.png';
   var smallIcon = L.icon({
                      iconSize: [27, 27],
                      iconAnchor: [13, 27],
                      popupAnchor:  [1, -24],
                      iconUrl: iconPath
   });

   return L.marker(latlng, {icon: smallIcon});
}

var tourismLayer = L.geoJson( tourismeaude,{
    onEachFeature: onEachFeature,
    pointToLayer: iconifyFeature, 
});

var historicLayer = L.geoJson( historic_ruins,{
    onEachFeature: onEachHistoric,
    pointToLayer: colorizeFeature, 
});


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
    "Tourisme": tourismLayer, 
    "Histoire": historicLayer
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
//
//


/*
* show/hide layerGroup   
*/
function showLayer(id) {
    var lg = mapLayerGroups[id];
    map.addLayer(lg);   
}
function hideLayer(id) {
    var lg = mapLayerGroups[id];
    map.removeLayer(lg);   
}
function showOnlyLayer(id){
    selectedType=id;
    for(var key in mapLayerGroups )
    {
        hideLayer( key );
    }
    showLayer(id);
}

function toggleLayer( id ){
    console.log(id);
    if ( selectedLayers[id] === undefined ){
        showLayer( id );
        selectedLayers[id]=1;
    }else{
        hideLayer( id );
        delete selectedLayers[id];
    }
}

//map.fitBounds(audeContourLayer.getBounds());
