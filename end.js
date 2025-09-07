function fillFromStorage(id, storageKey, transformation) {
    let result = localStorage.getItem("gemeindeguessr." + storageKey);
    let element = document.getElementById(id);

    if (transformation) {
        element.innerHTML = transformation(result);
    } else {
        element.innerHTML = result;
    }
}

function fill() {
    fillFromStorage("finalPoints", "points");
    fillFromStorage("finalGuesses", "guesses");
    fillFromStorage("areaName", "area", function (area) { return area.toUpperCase() });
    fillFromStorage("bestGuesses", "minimumTurnsRequired");
}

function goBack() {
    window.location.href = "/"
}

fill();