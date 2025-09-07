function start() {
    localStorage.setItem("gemeindeguessr.points", 0);
    localStorage.setItem("gemeindeguessr.guesses", 0);

    let area = document.getElementById("selectArea")
    localStorage.setItem("gemeindeguessr.area", area.value);
    localStorage.setItem("gemeindeguessr.running", true);

    window.location.href = "/running.html"
}