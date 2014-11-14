var z = 10;
var myLL = L.latLng(43.03,2.48);
var defaultColor="#ff7800";
var defaultIcon="default";
var defaultType="default";
var selectedType="information";
var selectedLayers = [];
var mapLayerGroups = [];

var featureTypes = {
    'wayside_shrine': {type: 'wayside_shrine', color: '#3A01DF', title: 'Chapelle'},
    'wayside_cross': {type: 'wayside_cross', color: 'yellow', title: 'Croix'},
    'archaeological_site': {type: 'archaeological_site', color: '#B45F04', title: 'Site Archéologique'},
    'castle': {type: 'castle', color: 'green', title: 'Châteaux'},
    'ruins': {type: 'ruins', color: 'blue', title: 'Ruines'},
    'camp_site': {type: 'camp_site', color: '#0f0', title: 'Camping'},
    'caravan_site': {type: 'caravan_site', color: '#0f0', title: 'Aire pour Caravanes'},
    'hotel': {type: 'hotel', color: '#ff0', title: 'Hôtel'},
    'motel': {type: 'motel', color: '#ff0', title: 'Motel'},
    'hostel': {type: 'hostel', color: '#ff0', title: 'Hôtel'},
    'information': {type: 'information', color: '#0ff', title: 'Information'},
    'picnic_site': {type: 'picnic_site', color: '#f0f', title: 'Aire de PicNic'},
    'attraction': {type: 'attraction', color: '#B45F04', title: 'attraction'},
    'zoo': {type: 'zoo', color: '#B45F04', title: 'zoo'},
    'chalet': {type: 'chalet', color: '#DF013A', title: 'chalet'},
    'guest_house': {type: 'guest_house', color: '#A901DB', title: 'guest_house'},
    'bed_and_breakfast': {type: 'bed_and_breakfast', color: '#A901DB', title: 'bed_and_breakfast'},
    'viewpoint': {type: 'viewpoint', color: '#3A01DF', title: 'Point de Vue'},
    'museum': {type: 'museum', color: '#0174DF', title: 'Musée'},
    'artwork': {type: 'artwork', color: '#D7DF01', title: 'Oeuvre d\'Art'}
};

/*
 * Get tourism or historic feature property value
 */
function feature2type( feature ){
    var keyValue = "none";
    if ( feature.properties.tourism ){
        keyValue = feature.properties.tourism;
    } else if ( feature.properties.historic ){
        keyValue = feature.properties.historic;
    } 
    var featureType = featureTypes[keyValue] ? featureTypes[keyValue].type : defaultType;
    console.log( featureType);
    return featureType;
}

function type2iconpath( type ){
    var value = featureTypes[type] ? type: defaultIcon;
    return "data/icons/"+value+".png";
}


function feature2popup( feature ){
    var popupcontent="";

    if (feature.properties){
        if ( feature.properties.name) {
            popupcontent="name: "+feature.properties.name+"</br>";
        }
        if ( feature.properties.tourism){
                popupcontent+="tourism: "+feature.properties.tourism;
        }
        if ( feature.properties.historic){
                popupcontent+="historic: "+feature.properties.historic;
        }
    }
    return popupcontent;
}

/*
 * dynamically fill toolbar
 */
function fillToolBar(){
    for(var key in featureTypes ) {
        var img = $('<img title="'+featureTypes[key].title+'" id="'+key+'" src="'+type2iconpath(key)+'"></li>');
        img.click(function(){ toggleLayer( $(this).attr("id") ); $(this).toggleClass("shade")});
        var li = $("<li></li>");
        li.append( img );
        $("#toolbar").append(li);
    }
}


// create a map in the "map" div, set the view to a given place and zoom
var map = L.map('map');
//var map = L.map('map', {
//    center: myLL,
//    zoom: z,
//    maxZoom: 15,
//    minZoom: 9
//});

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
        if ( feature.properties.historic){
            popupcontent+="historic: "+feature.properties.historic;
        }
    }
    featureLayer.bindPopup(popupcontent);
}

function onEachFeature(feature, featureLayer) {

    var featureType = feature2type( feature );

    // create popup at click on feature
    featureLayer.bindPopup(feature2popup( feature));

    // now add to layer group based on type
    // ( from http://stackoverflow.com/questions/16148598/leaflet-update-geojson-filter )
    //
    // does layerGroup already exist? if not create it and add to map
    var lg = mapLayerGroups[featureType];

    if (lg === undefined) {
        lg = new L.layerGroup();
        //add the layer to the map
        lg.addTo(map);
        //store layer
        mapLayerGroups[featureType] = lg;
    }

    //add the feature to the layer
    lg.addLayer(featureLayer);
    // add type to selected
    selectedLayers[featureType]=1;
}

function featureToColor( feature ){
    var color = "red"
   var historicVal = feature.properties.historic;
    if (  historicVal && featureTypes[historicVal] ) {
        color = featureTypes[historicVal].color;
    }
    return color;
}

function colorizeFeature(feature, latlng) {

    var color = featureToColor( feature); 
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

   var featureType = feature2type( feature ) ;
   var iconPath = type2iconpath( featureType );

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
}).addTo(map);

var historicLayer = L.geoJson( historic_ruins,{
    onEachFeature: onEachFeature,
    pointToLayer: iconifyFeature, 
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
    "Tourisme": tourismLayer, 
    "Histoire": historicLayer
};

// Layers switchers
L.control.layers(baseLayers, overLays).setPosition('topright').addTo(map);

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
    if ( selectedLayers[id] === undefined ){
        showLayer( id );
        selectedLayers[id]=1;
    }else{
        hideLayer( id );
        delete selectedLayers[id];
    }
}

map.fitBounds(audeContourLayer.getBounds());
map.setMaxBounds( map.getBounds() );
map.options.minZoom = map.getZoom();
fillToolBar();
