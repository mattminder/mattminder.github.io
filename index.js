
var map;
var polygonLayers;
var randomCity;

function setUp() {
    // Create map and attach id to element with id "mapid"
    var map = L.map('mapid').setView([46.6, 8.5], 8);

    // add openstreetmap-tiles in the background
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    return map
}

function chooseRandomPolygon() {
    randomCity = polygonLayers[Math.floor(Math.random() * polygonLayers.length)];
    document.getElementById("randomCity").innerHTML=randomCity.name;
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

    return $.getJSON("polygons_simple50.geojson",
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

map = setUp()
drawAll().then(chooseRandomPolygon)

function showAnswer() {
    randomCity.layer.setStyle({fillColor: '#FF0000', fillOpacity: 1, color: '#FF0000'});
}

function nextCity() {
    randomCity.layer.setStyle({fillColor: '#3273a8', fillOpacity: .5, color: '#3273a8'});
    chooseRandomPolygon()
}
