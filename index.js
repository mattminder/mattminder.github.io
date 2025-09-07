var map;
var polygonLayers;
var randomCity;
var backgroundMap;
var backgroundMapIsShowing;
var points;

// Functions interacting with localStorage
function getPoints() {
    return Number(localStorage.getItem("gemeindeguessr.points"));
}

function setPoints(points) {
    return localStorage.setItem("gemeindeguessr.points", points)
}

function increasePoints(delta) {
    points = getPoints();
    setPoints(points + delta);
}

function initializePoints() {
    if (typeof localStorage.getItem("gemeindeguessr.points") === "undefined") {
        setPoints(0);
    }
}

function areaIsSelected() {
    return (typeof localStorage.getItem("gemeindeguessr.selectedArea") === "undefined")
}

function selectArea() {
    let selectedArea = document.getElementById("selectArea");
    localStorage.setItem("gemeindeguessr.selectedArea", selectedArea.value);
}

function getFileName() {
    let selectedArea = localStorage.getItem("gemeindeguessr.selectedArea");
    return "polygons/polygons_" + selectedArea + ".geojson";
}

function setUp() {
    // Create map and attach id to element with id "mapid"
    map = L.map('mapid').setView([46.6, 8.5], 8);
    initializePoints();
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

function correctGuess() {
    showCorrectAnswer();
    increasePoints(3);
}

function incorrectGuess() {
    showIncorrectAnswer();
    increasePoints(-1);
}

function showPoints() {
    container = document.getElementById("points");
    container.innerHTML = getPoints();
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
    selectArea();
    drawAll().then(chooseRandomPolygon);
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

