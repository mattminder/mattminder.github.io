function fill() {
    let points = localStorage.getItem("gemeindeguessr.points");
    let pointElement = document.getElementById("finalPoints");
    pointElement.innerHTML = points;

    let areaName = localStorage.getItem("gemeindeguessr.area");
    let areaElement = document.getElementById("areaName");
    areaElement.innerHTML = areaName.toUpperCase();
}

function goBack() {
    window.location.href = "/"
}

fill();