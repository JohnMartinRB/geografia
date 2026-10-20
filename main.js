let currentSlide = 1;
const totalSlides = 10;

tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },
            colors: {
                brand: {
                    bg: "#0B0F19",
                    card: "#111827",
                    border: "#1F2937",
                    accent: "#3B82F6",
                    cyan: "#06B6D4",
                    purple: "#8B5CF6",
                },
            },
        },
    },
};

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

// Datos Históricos Oficiales de Población Mundial (Fuente: ONU / Our World in Data)
const historicalData = [
    { x: 0, y: 0.19, phase: 1 },
    { x: 500, y: 0.19, phase: 1 },
    { x: 1000, y: 0.29, phase: 1 },
    { x: 1500, y: 0.45, phase: 1 },
    { x: 1750, y: 0.79, phase: 2 },
    { x: 1800, y: 0.98, phase: 2 },
    { x: 1850, y: 1.26, phase: 2 },
    { x: 1900, y: 1.65, phase: 2 },
    { x: 1950, y: 2.52, phase: 3 },
    { x: 1974, y: 4.0, phase: 3 },
    { x: 2000, y: 6.14, phase: 3 },
    { x: 2022, y: 8.0, phase: 3 },
    { x: 2026, y: 8.15, phase: 3 },
];

let myChart = null;

window.addEventListener("DOMContentLoaded", () => {
    const ctx = document.getElementById("populationChart").getContext("2d");

    // Degradado cian/púrpura para el área bajo la curva
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(6, 182, 212, 0.4)");
    gradient.addColorStop(1, "rgba(139, 92, 246, 0.0)");

    myChart = new Chart(ctx, {
        type: "line",
        data: {
            datasets: [
                {
                    label: "Población Mundial (Miles de Millones)",
                    data: historicalData,
                    borderColor: "#06b6d4",
                    borderWidth: 3,
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.35,
                    pointBackgroundColor: "#06b6d4",
                    pointRadius: 4,
                    pointHoverRadius: 7,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: "linear",
                    position: "bottom",
                    title: {
                        display: true,
                        text: "Año Histórico",
                        color: "#94a3b8",
                    },
                    ticks: {
                        color: "#94a3b8",
                        callback: function (value) {
                            return value === 0 ? "Año 0" : value;
                        },
                    },
                    grid: { color: "rgba(255, 255, 255, 0.05)" },
                },
                y: {
                    title: {
                        display: true,
                        text: "Habitantes (Miles de Millones)",
                        color: "#94a3b8",
                    },
                    min: 0,
                    max: 9,
                    ticks: {
                        color: "#94a3b8",
                        stepSize: 2,
                    },
                    grid: { color: "rgba(255, 255, 255, 0.05)" },
                },
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `Población: ${context.parsed.y} mil millones`;
                        },
                    },
                },
            },
        },
    });
});

// Función para filtrar fases y cambiar textos explicativos
function filterPhase(phaseKey) {
    const buttons = ["all", "fase1", "fase2", "fase3"];
    buttons.forEach((key) => {
        const btn = document.getElementById(`btn-${key}`);
        if (key === phaseKey) {
            btn.style.background = "var(--accent-cyan)";
            btn.style.color = "#000";
            btn.style.fontWeight = "bold";
        } else {
            btn.style.background = "rgba(15, 23, 42, 0.6)";
            btn.style.color = "#cbd5e1";
            btn.style.fontWeight = "normal";
        }
    });

    const infoTitle = document.getElementById("info-title");
    const infoContent = document.getElementById("info-content");

    if (phaseKey === "all") {
        myChart.data.datasets[0].data = historicalData;
        infoTitle.innerText = "¿Por qué este gráfico es conceptualmente correcto?";
        infoContent.innerHTML = `
                        <p><strong>1. Gráfico de línea continua vs. Barras:</strong> La población humana es un fenómeno dinámico histórico. La línea continua muestra la progresión fluida a través del tiempo, permitiendo apreciar la famosa <em>"Curva en J"</em>.</p>
                        <p><strong>2. Escala temporal real (Eje X):</strong> Los años guardan su verdadera distancia proporcional. Se observa que la población tardó más de 17 siglos en alcanzar los primeros 1.000 millones, y solo ~200 años en multiplicarse por 8.</p>
                        <p><strong>3. Eje Y preciso:</strong> Expresa la población real en miles de millones (0 a 8.1 mil millones), eliminando cualquier ambigüedad.</p>
                    `;
    } else if (phaseKey === "fase1") {
        myChart.data.datasets[0].data = historicalData.filter((d) => d.phase === 1);
        infoTitle.innerText = "Fase 1: Lento Crecimiento (Año 0 al 1750)";
        infoContent.innerHTML = `
                        <p><strong>Régimen Demográfico Antiguo:</strong> Altas tasas de natalidad acompañadas por altas tasas de mortalidad debido a epidemias, guerras y hambrunas periódicas.</p>
                        <p>La curva se mantiene casi plana durante más de 17 siglos, tardando miles de años en aproximarse a los 800 millones de habitantes.</p>
                    `;
    } else if (phaseKey === "fase2") {
        myChart.data.datasets[0].data = historicalData.filter((d) => d.phase <= 2);
        infoTitle.innerText = "Fase 2: Despegue Industrial (1750 al 1950)";
        infoContent.innerHTML = `
                        <p><strong>Inicio de la Transición Demográfica:</strong> La Revolución Industrial introduce alcantarillado, agua potable, vacunas y producción agrícola a gran escala.</p>
                        <p>La mortalidad cae drásticamente mientras la natalidad se mantiene alta, haciendo que la población alcance sus primeros 1.000 millones hacia 1804 y 2.500 millones en 1950.</p>
                    `;
    } else if (phaseKey === "fase3") {
        myChart.data.datasets[0].data = historicalData;
        infoTitle.innerText = "Fase 3: Explosión Demográfica (1950 al Presente)";
        infoContent.innerHTML = `
                        <p><strong>Crecimiento Exponencial Explicitado:</strong> Globalización de la medicina moderna, antibióticos y avances de salud pública en países en desarrollo.</p>
                        <p>La curva se torna prácticamente vertical: la población mundial pasa de 2.500 millones en 1950 a superar los 8.000 millones en la actualidad.</p>
                    `;
    }
    myChart.update();
}
