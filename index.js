var map;
var polygonLayers;
var randomCity;
var backgroundMap;
var backgroundMapIsShowing;
var points;

function setUp() {
    // Create map and attach id to element with id "mapid"
    map = L.map('mapid').setView([46.6, 8.5], 8);
    points = 0;
    showPoints();

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
    document.getElementById("randomCity").innerHTML = randomCity.name;
}

function getFileName() {
    let selectElement = document.getElementById("selectArea");
    return "polygons/polygons_" + selectElement.value + ".geojson";
}

function correctGuess() {
    showCorrectAnswer();
    points = points + 3;
}

function incorrectGuess() {
    showIncorrectAnswer();
    points = points - 1;
}

function showPoints() {
    container = document.getElementById("points");
    container.innerHTML = points;
}

function createClickHandler(feature, layer) {

    return function () {
        if (feature.properties.name === randomCity.name) {
            correctGuess(layer);
        } else {
            incorrectGuess(layer);
        }
        showPoints();

        // Ask for next city after 1.5s
        setTimeout(nextCity, 1500);
    }
}


function drawAll() {
    // load the polygons tile layer
    polygonLayers = []

    function onEachGeoJSON(feature, layer) {
        // layer.bindPopup("<strong>" + feature.properties.name + "</strong><br/>");
        
        polygonLayers.push(
            {
                "name": feature.properties.name,
                "layer": layer
            }
        );
        layer.on("click", createClickHandler(feature, layer))
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

function showIncorrectAnswer() {
    randomCity.layer.setStyle({fillColor: '#FF0000', fillOpacity: 1, color: '#FF0000'});
}

function showCorrectAnswer() {
    randomCity.layer.setStyle({fillColor: '#a7bfd3ff', fillOpacity: 1, color: '#a7bfd3ff'});
}

function nextCity() {
    randomCity.layer.setStyle({fillColor: '#3273a8', fillOpacity: .5, color: '#3273a8'});
    chooseRandomPolygon()
}

setUp()
completeLoad()

