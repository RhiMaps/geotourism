var z = 10;
var myLL = L.latLng(43.03, 2.48);
var defaultColor = "#ff7800";
var defaultIcon = "default";
var defaultType = "default";
var selectedType = "information";
var selectedLayers = [];
var mapLayerGroups = [];

var featureTypes = {
    'yes': 'wayside_shrine',
    'monastery': 'wayside_shrine',
    'wayside_shrine': 'wayside_shrine',
    'wayside_cross': 'wayside_shrine',
    'camp_site': 'camp_site',
    'caravan_site': 'camp_site',
    'apartment': 'hotel',
    'hotel': 'hotel',
    'motel': 'hotel',
    'hostel': 'hotel',
    'chalet': 'hotel',
    'guest_house': 'hotel',
    'bed_and_breakfast': 'hotel',
    'information': 'information',
    'picnic_site': 'picnic_site',
    'attraction': 'attraction',
    'theme_park': 'attraction',
    'zoo': 'attraction',
    'viewpoint': 'viewpoint',
    'museum': 'artwork',
    'artwork': 'artwork',
    'archaeological_site': 'archaeological_site',
    'castle': 'castle',
    'ruins': 'ruins',
};

var typesTable = {
    'wayside_shrine': {
        color: '#3A01DF',
        title: 'Chapelle',
        show: false
    },
    'archaeological_site': {
        color: '#B45F04',
        title: 'Site Archéologique',
        show: false
    },
    'castle': {
        color: 'green',
        title: 'Châteaux',
        show: true
    },
    'ruins': {
        color: 'blue',
        title: 'Ruines',
        show: true
    },
    'camp_site': {
        color: '#0f0',
        title: 'Camping',
        show: false
    },
    'hotel': {
        color: '#ff0',
        title: 'Hôtel',
        show: false
    },
    'information': {
        color: '#0ff',
        title: 'Information',
        show: false
    },
    'picnic_site': {
        color: '#f0f',
        title: 'Aire de PicNic',
        show: false
    },
    'attraction': {
        color: '#B45F04',
        title: 'Attraction',
        show: false
    },
    'viewpoint': {
        color: '#3A01DF',
        title: 'Point de Vue',
        show: false
    },
    'artwork': {
        color: '#D7DF01',
        title: 'Oeuvre d\'Art',
        show: false
    }
};


function type2title(type) {
    return typesTable[type] ? typesTable[type].title : "no title";
}


/*
 * Get tourism or historic feature property value
 */
function feature2type(feature) {
    var keyValue = "none";
    if (feature.properties.tourism) {
        keyValue = feature.properties.tourism;
    } else if (feature.properties.historic) {
        keyValue = feature.properties.historic;
    }
    var featureType = featureTypes[keyValue] ? featureTypes[keyValue] : defaultType;
    return featureType;
}

function type2class(type) {
    var returnedClass="shade";
    if(  typesTable[type] && typesTable[type].show  ){
        returnedClass="high";
    }
    return returnedClass;
}

function type2iconpath(type) {
    var value = featureTypes[type] ? type : defaultIcon;
    return "data/icons/" + value + ".png";
}


function feature2popup(feature) {
    var popupcontent = "";

    if (feature.properties) {
        if (feature.properties.name) {
            popupcontent = '<p class="poiname"> ' + feature.properties.name + '</p>';
        }
        //if (feature.properties.tourism) {
        //    popupcontent += "tourism: " + feature.properties.tourism;
        //}
        //if (feature.properties.historic) {
        //    popupcontent += "historic: " + feature.properties.historic;
        //}
        if (feature.properties["@id"] && "node/1753876165"==feature.properties["@id"]){
            popupcontent += '<a href="http://fr.wikipedia.org/wiki/Belcastel-et-Buc">Belcastel-et-Buc sur wikipedia</a>';
            popupcontent += '<img src="data/photos/belcastel.jpg" class="poimg"/>';
        }
        if (feature.properties["@id"] && "node/1753686821"==feature.properties["@id"]){
            popupcontent += '<a href="http://www.audecathare.fr/abbayes/eglise_saint_polycarpe.htm">Saint Polycarpe sur audecathare.fr</a>';
            popupcontent += '<img src="data/photos/polycarpe.jpg" class="poimg"/>';
        }
        if (feature.properties["@id"] && "node/1805880699"==feature.properties["@id"]){
            popupcontent += '<a href="http://fr.wikipedia.org/wiki/Abbaye_d%27Alet-les-Bains">L\'abbaye sur wikipedia</a>';
            popupcontent += '<img src="data/photos/alet.jpg" class="poimg"/>';
        }
    }
    return popupcontent;
}

// create a map in the "map" div, set the view to a given place and zoom
//var map = L.map('map');
var map = L.map('map', {
    center: myLL,
    zoom: z,
    maxZoom: 15,
    minZoom: 9
});

// add an OpenStreetMap tile layer
var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: 'OpenStreetMap'
});

var forestLayer = L.tileLayer('http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
});

var worldTopoLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
});

var worldStreetLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
}).addTo(map);

var waterColorLayer = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    subdomains: 'abcd',
    minZoom: 1,
    maxZoom: 16
});

var esriLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var mapqLayer = L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
    attribution: 'MapQuest OpenStreetMap',
    subdomains: ['otile1', 'otile2', 'otile3', 'otile4']
});

function onEachHistoric(feature, featureLayer) {
    // create popup at click on feature
    var popupcontent = "";
    if (feature.properties) {
        if (feature.properties.name) {
            popupcontent = "name: " + feature.properties.name + "</br>";
        }
        if (feature.properties.historic) {
            popupcontent += "historic: " + feature.properties.historic;
        }
    }
    featureLayer.bindPopup(popupcontent);
}

function onEachFeature(feature, featureLayer) {

    var featureType = feature2type(feature);

    // create popup at click on feature
    featureLayer.bindPopup(feature2popup(feature));

    // now add to layer group based on type
    // ( from http://stackoverflow.com/questions/16148598/leaflet-update-geojson-filter )
    //
    // does layerGroup already exist? if not create it and add to map
    var lg = mapLayerGroups[featureType];

    if (lg === undefined) {
        lg = new L.layerGroup();
        //store layer
        mapLayerGroups[featureType] = lg;
        if(  typesTable[featureType] && typesTable[featureType].show  ){
            console.log( featureType+" allowed ("+typesTable[featureType].show+")");
            // add type to selected
            selectedLayers[featureType] = 1;
            //add the layer to the map
            lg.addTo(map);
        }
    }

    //add the feature to the layer
    lg.addLayer(featureLayer);

}

function featureToColor(feature) {
    var color = "red"
    var historicVal = feature.properties.historic;
    if (historicVal && featureTypes[historicVal]) {
        color = featureTypes[historicVal].color;
    }
    return color;
}

function colorizeFeature(feature, latlng) {

    var color = featureToColor(feature);
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

function iconifyFeature(feature, latlng) {

    var featureType = feature2type(feature);
    var iconPath = type2iconpath(featureType);

    var smallIcon = L.icon({
        iconSize: [27, 27],
        iconAnchor: [13, 27],
        popupAnchor: [1, -24],
        iconUrl: iconPath
    });

    return L.marker(latlng, {
        icon: smallIcon
    });
}

var tourismLayer = L.geoJson.ajax('data/tourisme-aude.json', {
    onEachFeature: onEachFeature,
    pointToLayer: iconifyFeature,
});

var historicLayer = L.geoJson.ajax('data/historic-ruins.json', {
    onEachFeature: onEachFeature,
    pointToLayer: iconifyFeature,
});

var audeContourLayer = L.geoJson.ajax('data/aude.json', {
    smoothFactor: "5",
    style: {
        "opacity": "1",
        "weight": "2",
        "color": "green",
        "fillOpacity": "0.1",
        "fillColor": "yellow",
    }
}).addTo(map);

var limouxinLayer = L.geoJson.ajax('data/limouxin.json', {
    smoothFactor: "1",
    style: {
        "fillOpacity": "0.1",
        "fillColor": "#800000",
        "opacity": "0.5",
        "weight": "2",
        "color": "black",
    }
}).addTo(map);

var baseLayers = {
    "Satellite": esriLayer,
    "OSM": osmLayer,
    "MapBox": mapqLayer,
    "Topographique": worldTopoLayer,
    "Street": worldStreetLayer,
    "Gouache": waterColorLayer,
    "Forêts": forestLayer
};

//
var overLays = {
    "Aude": audeContourLayer,
    "Limouxin": limouxinLayer
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

function showOnlyLayer(id) {
    selectedType = id;
    for (var key in mapLayerGroups) {
        hideLayer(key);
    }
    showLayer(id);
}

function toggleLayer(id) {
    if (selectedLayers[id] === undefined) {
        showLayer(id);
        selectedLayers[id] = 1;
    } else {
        hideLayer(id);
        delete selectedLayers[id];
    }
    $("#"+id).toggleClass("shade");
}

/*
 * dynamically fill toolbar
 * From dynamical layer groups
 */
function fillToolBar() {
    for (var key in typesTable) {
        var img = $('<img title="' + type2title(key) + '" id="' + key + '" class="'+type2class(key)+'" src="' + type2iconpath(key) + '"></li>');
        img.click(function() {
            toggleLayer($(this).attr("id"));
        });
        var li = $("<li></li>");
        li.append(img);
        $("#toolbar").append(li);
    }
}


//map.fitBounds(audeContourLayer.getBounds());
map.setMaxBounds(map.getBounds());
//map.options.minZoom = map.getZoom();
fillToolBar();
