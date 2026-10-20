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

// --- Datos y Lógica del Gráfico Dinámico (Slide 6) ---
const rawData = [
    { year: 0, pop: 0.25, label: "Año 0", phase: "fase1", note: "Antigüedad" },
    { year: 1000, pop: 0.31, label: "Año 1000", phase: "fase1", note: "Edad Media" },
    { year: 1500, pop: 0.5, label: "Año 1500", phase: "fase1", note: "Renacimiento" },
    { year: 1750, pop: 0.79, label: "1750", phase: "fase2", note: "Inicio Rev. Industrial" },
    { year: 1800, pop: 0.98, label: "1800", phase: "fase2", note: "1.000 Millones" },
    { year: 1900, pop: 1.65, label: "1900", phase: "fase2", note: "Avances Sanitarios" },
    { year: 1950, pop: 2.52, label: "1950", phase: "fase3", note: "Inicio Explosión Demográfica" },
    { year: 2000, pop: 6.13, label: "2000", phase: "fase3", note: "Crecimiento Exponencial" },
    { year: 2026, pop: 8.15, label: "2026 (Actual)", phase: "fase3", note: "+8 Mil Millones" },
];

let chartInstance = null;

function initPopulationChart() {
    const canvasElement = document.getElementById("populationChart");
    if (!canvasElement) return;

    const ctx = canvasElement.getContext("2d");

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(6, 182, 212, 0.4)");
    gradient.addColorStop(1, "rgba(139, 92, 246, 0)");

    chartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: rawData.map((d) => d.year),
            datasets: [
                {
                    label: "Población Mundial (Miles de Millones)",
                    data: rawData.map((d) => ({ x: d.year, y: d.pop, note: d.note })),
                    borderColor: "#06B6D4",
                    borderWidth: 3,
                    pointBackgroundColor: "#8b5cf6",
                    pointBorderColor: "#0f172a",
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    fill: true,
                    backgroundColor: gradient,
                    tension: 0.35,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    titleColor: "#06B6D4",
                    bodyColor: "#F3F4F6",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderWidth: 1,
                    callbacks: {
                        title: (context) =>
                            `Año ${rawData[context[0].dataIndex].year} (${rawData[context[0].dataIndex].note})`,
                        label: (context) => ` Población estimada: ${context.parsed.y} mil millones`,
                    },
                },
            },
            scales: {
                x: {
                    type: "linear",
                    position: "bottom",
                    min: 0,
                    max: 2050,
                    ticks: { color: "#94a3b8", stepSize: 250 },
                    grid: { color: "rgba(255, 255, 255, 0.05)" },
                },
                y: {
                    min: 0,
                    max: 9,
                    ticks: {
                        color: "#94a3b8",
                        callback: (value) => value + " mil M",
                    },
                    grid: { color: "rgba(255, 255, 255, 0.05)" },
                },
            },
        },
    });
}

function filterPhase(phase) {
    // Actualizar clases de los botones de filtro
    ["all", "fase1", "fase2", "fase3"].forEach((p) => {
        const btn = document.getElementById(`btn-${p}`);
        if (btn) {
            if (p === phase) btn.classList.add("active-filter");
            else btn.classList.remove("active-filter");
        }
    });

    const infoTitle = document.getElementById("info-title");
    const infoContent = document.getElementById("info-content");

    if (!chartInstance) return;

    if (phase === "all") {
        if (infoTitle) infoTitle.innerText = "¿Por qué este gráfico es conceptualmente correcto?";
        if (infoContent)
            infoContent.innerHTML =
                "Utiliza una línea continua y escala temporal real para apreciar la <em>'Curva en J'</em> de la población mundial.";
        chartInstance.data.datasets[0].pointRadius = rawData.map(() => 5);
    } else if (phase === "fase1") {
        if (infoTitle) infoTitle.innerText = "Fase 1: Lento Crecimiento (Antigüedad y Edad Media)";
        if (infoContent)
            infoContent.innerHTML =
                "Crecimiento plano debido a altas tasas de mortalidad por guerras, hambrunas y epidemias. Población en 1750: ~790 millones.";
        chartInstance.data.datasets[0].pointRadius = rawData.map((d) => (d.phase === phase ? 8 : 3));
    } else if (phase === "fase2") {
        if (infoTitle) infoTitle.innerText = "Fase 2: Despegue Industrial (1750 - 1950)";
        if (infoContent)
            infoContent.innerHTML =
                "La Revolución Industrial y la medicina moderna reducen la mortalidad. En 1800 se superan los 1.000 millones.";
        chartInstance.data.datasets[0].pointRadius = rawData.map((d) => (d.phase === phase ? 8 : 3));
    } else if (phase === "fase3") {
        if (infoTitle) infoTitle.innerText = "Fase 3: La Explosión Demográfica (1950 - Actualidad)";
        if (infoContent)
            infoContent.innerHTML =
                "Curva vertical. La salud pública global y la Revolución Verde disparan la población hasta superar los 8 mil millones.";
        chartInstance.data.datasets[0].pointRadius = rawData.map((d) => (d.phase === phase ? 8 : 3));
    }
    chartInstance.update();
}

// Inicializar el gráfico al cargar la página junto con tus otras funciones
window.addEventListener("DOMContentLoaded", () => {
    initPopulationChart();
});
