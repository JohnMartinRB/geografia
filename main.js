let currentSlide = 1;
const totalSlides = 10;

function changeSlide(direction) {
    document.getElementById(`slide-${currentSlide}`).classList.remove("active");

    currentSlide += direction;

    if (currentSlide < 1) currentSlide = 1;
    if (currentSlide > totalSlides) currentSlide = totalSlides;

    document.getElementById(`slide-${currentSlide}`).classList.add("active");
    document.getElementById("counter").innerText = `Diapositiva ${currentSlide} de ${totalSlides}`;

    document.getElementById("prevBtn").disabled = currentSlide === 1;
    document.getElementById("nextBtn").disabled = currentSlide === totalSlides;
}

// Función global de teclado para avanzar/retroceder con flechas
document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight" || event.key === "PageDown") {
        changeSlide(1);
    } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        changeSlide(-1);
    }
});
