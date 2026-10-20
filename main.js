let currentSlide = 1;
const totalSlides = 10;

// Asegurar el foco al cargar la página para que las flechas funcionen de inmediato
window.onload = function () {
    document.getElementById("bodyRoot").focus();
};

function changeSlide(direction) {
    document.getElementById(`slide-${currentSlide}`).classList.remove("active");

    currentSlide += direction;

    if (currentSlide < 1) currentSlide = 1;
    if (currentSlide > totalSlides) currentSlide = totalSlides;

    document.getElementById(`slide-${currentSlide}`).classList.add("active");
    document.getElementById("counter").innerText = `Diapositiva ${currentSlide} de 10`;

    document.getElementById("prevBtn").disabled = currentSlide === 1;
    document.getElementById("nextBtn").disabled = currentSlide === totalSlides;

    // Mantener el foco activo
    document.getElementById("bodyRoot").focus();
}

// Detector global de teclado reforzado
window.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault(); // Evita el scroll de la página
        changeSlide(1);
    } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        changeSlide(-1);
    }
});
