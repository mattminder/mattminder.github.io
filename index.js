var map;
var polygonLayers;
var randomCity;
var backgroundMap;
var backgroundMapIsShowing;

function setUp() {
    // Create map and attach id to element with id "mapid"
    map = L.map('mapid').setView([46.6, 8.5], 8);

    // add openstreetmap-tiles in the background
    addBackgroundMap()
}

function addBackgroundMap() {
    backgroundMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}

function removeBackgroundMap() {
    map.removeLayer(backgroundMap)
}

function toggleBackgroundMap() {
    if (map.hasLayer(backgroundMap)) {
        map.removeLayer(backgroundMap)
    } else {
        backgroundMap.addTo(map)
    }
}


function chooseRandomPolygon() {
    randomCity = polygonLayers[Math.floor(Math.random() * polygonLayers.length)];
    document.getElementById("randomCity").innerHTML=randomCity.name;
}

function getFileName() {
    let selectElement = document.getElementById("selectArea");
    return selectElement.value + ".geojson";
}

function drawAll() {
    // load the polygons tile layer
    polygonLayers = []

    function onEachGeoJSON(feature, layer) {
        layer.bindPopup("<strong>" + feature.properties.name + "</strong><br/>");
        polygonLayers.push(
            {
                "name": feature.properties.name,
                "layer": layer
            }
        );
    }

    return $.getJSON(getFileName(),
        function(hoodData) {
            L.geoJson( 
                hoodData, 
                {
                    onEachFeature: onEachGeoJSON,
                    fillColor: '#3273a8',
                    color: '#3273a8',
                    weight: 1,
                    fillOpacity: .5,
                }
            ).addTo(map);
        }
    )
}

function completeLoad() {
    drawAll().then(chooseRandomPolygon)
}

function deleteAll() {
    polygonLayers.map(
        function (e) {
            map.removeLayer(e.layer)
        }
    )
}

function showAnswer() {
    randomCity.layer.setStyle({fillColor: '#FF0000', fillOpacity: 1, color: '#FF0000'});
}

function nextCity() {
    randomCity.layer.setStyle({fillColor: '#3273a8', fillOpacity: .5, color: '#3273a8'});
    chooseRandomPolygon()
}

setUp()
completeLoad()

