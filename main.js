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

    // MAGIA ACÁ: Si pasamos a la diapositiva 6 y el gráfico no existe, lo creamos ahora que ya es visible
    if (currentSlide === 6 && !chartInstance) {
        setTimeout(() => {
            initChart();
        }, 100);
    }

    const bodyRoot = document.getElementById("bodyRoot");
    if (bodyRoot) bodyRoot.focus();
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

// Datos históricos corregidos (Año vs Población en miles de millones)
const rawData = [
    { year: 0, pop: 0.25, label: "Año 0", phase: "fase1", note: "Imperio Romano / Han" },
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

// Inicializar Chart.js
function initChart() {
    const ctx = document.getElementById("populationChart").getContext("2d");

    // Gradient para la línea del gráfico
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(6, 182, 212, 0.4)");
    gradient.addColorStop(0.5, "rgba(59, 130, 246, 0.1)");
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
                    pointBackgroundColor: "#3B82F6",
                    pointBorderColor: "#0B0F19",
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 9,
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
                legend: {
                    display: false,
                },
                tooltip: {
                    backgroundColor: "rgba(17, 24, 39, 0.95)",
                    titleColor: "#06B6D4",
                    bodyColor: "#F3F4F6",
                    borderColor: "#1F2937",
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        title: function (context) {
                            const item = rawData[context[0].dataIndex];
                            return `Año ${item.year} (${item.note})`;
                        },
                        label: function (context) {
                            return `Población estimada: ${context.parsed.y} mil millones`;
                        },
                    },
                },
            },
            scales: {
                x: {
                    type: "linear",
                    position: "bottom",
                    min: 0,
                    max: 2050,
                    title: {
                        display: true,
                        text: "Línea de Tiempo (Años a escala real)",
                        color: "#9CA3AF",
                        font: { size: 12, family: "Inter" },
                    },
                    ticks: {
                        color: "#6B7280",
                        stepSize: 250,
                        callback: function (value) {
                            return value === 0 ? "Año 0" : value;
                        },
                    },
                    grid: {
                        color: "rgba(255, 255, 255, 0.05)",
                    },
                },
                y: {
                    min: 0,
                    max: 9,
                    title: {
                        display: true,
                        text: "Habitantes (Miles de Millones)",
                        color: "#9CA3AF",
                        font: { size: 12, family: "Inter" },
                    },
                    ticks: {
                        color: "#6B7280",
                        stepSize: 1,
                        callback: function (value) {
                            return value + " mil M";
                        },
                    },
                    grid: {
                        color: "rgba(255, 255, 255, 0.05)",
                    },
                },
            },
        },
    });
}

// Filtrar fases y actualizar información dinámica
function filterPhase(phase) {
    // Actualización de estilos de botones
    ["all", "fase1", "fase2", "fase3"].forEach((p) => {
        const btn = document.getElementById(`btn-${p}`);
        if (p === phase) {
            btn.className =
                "px-4 py-2 text-xs md:text-sm rounded-xl font-medium transition-all duration-300 bg-cyan-500 text-black shadow-lg shadow-cyan-500/20";
        } else {
            btn.className =
                "px-4 py-2 text-xs md:text-sm rounded-xl font-medium transition-all duration-300 bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700";
        }
    });

    const infoBox = document.getElementById("info-box");
    const infoTitle = document.getElementById("info-title");
    const infoContent = document.getElementById("info-content");

    if (phase === "all") {
        infoTitle.innerText = "¿Por qué este gráfico es conceptualmente correcto?";
        infoContent.innerHTML = `
          <p><strong>1. Gráfico de línea continua vs. Barras:</strong> La población humana es un fenómeno dinámico e histórico continuo. Un gráfico de líneas muestra la progresión fluida a través del tiempo, permitiendo apreciar la famosa <em>"Curva en J"</em>.</p>
          <p><strong>2. Escala temporal real (Eje X):</strong> A diferencia de las barras desconectadas del gráfico anterior, aquí los años guardan su verdadera distancia proporcional. Se observa claramente que la población tardó más de 17 siglos en alcanzar los primeros 1.000 millones, y solo ~200 años en multiplicarse por 8.</p>
          <p><strong>3. Eje Y preciso:</strong> Expresa la población real en miles de millones (de 0 a 8.1 mil millones), eliminando cualquier ambigüedad de lectura.</p>
        `;
        chartInstance.data.datasets[0].pointRadius = rawData.map(() => 6);
        chartInstance.data.datasets[0].pointBackgroundColor = rawData.map(() => "#3B82F6");
    } else if (phase === "fase1") {
        infoTitle.innerText = "Fase 1: Lento Crecimiento (Antigüedad y Edad Media)";
        infoContent.innerHTML = `
          <p>Durante casi 2000 años, el crecimiento demográfico fue sumamente lento y casi plano. Las altas tasas de natalidad eran compensadas por elevadísimas tasas de mortalidad debido a guerras, hambrunas y epidemias (como la Peste Negra en el siglo XIV).</p>
          <p class="text-cyan-400 font-medium">Población en el Año 1750: ~790 millones de habitantes.</p>
        `;
        highlightPoints("fase1");
    } else if (phase === "fase2") {
        infoTitle.innerText = "Fase 2: Despegue Industrial (1750 - 1950)";
        infoContent.innerHTML = `
          <p>Con el inicio de la Revolución Industrial en Europa y el desarrollo de la medicina moderna (vacunas, potabilización del agua, asepsia), la mortalidad cayó drásticamente mientras la natalidad se mantuvo alta.</p>
          <p class="text-cyan-400 font-medium">Hito histórico: En torno a 1800, la humanidad supera por primera vez los 1.000 millones de habitantes.</p>
        `;
        highlightPoints("fase2");
    } else if (phase === "fase3") {
        infoTitle.innerText = "Fase 3: La Explosión Demográfica (1950 - Actualidad)";
        infoContent.innerHTML = `
          <p>La curva se vuelve prácticamente vertical. La expansión de la salud pública global y mejoras en la producción agrícola (Revolución Verde) permitieron duplicar la población mundial en tiempo récord: de 2.500 millones en 1950 a más de 8.000 millones en la actualidad.</p>
          <p class="text-purple-400 font-medium">Población actual (2026): ~8.150 millones de habitantes.</p>
        `;
        highlightPoints("fase3");
    }

    chartInstance.update();
}

function highlightPoints(phase) {
    chartInstance.data.datasets[0].pointRadius = rawData.map((d) => (d.phase === phase ? 10 : 4));
    chartInstance.data.datasets[0].pointBackgroundColor = rawData.map((d) =>
        d.phase === phase ? "#06B6D4" : "#3B82F6",
    );
}

function handleNav(direction) {
    alert(`Navegación simulada: ${direction.toUpperCase()}`);
}

// Cargar gráfico al iniciar
// Inicializar Chart.js y asegurar el foco al cargar la página
window.onload = function () {
    const bodyRoot = document.getElementById("bodyRoot");
    if (bodyRoot) bodyRoot.focus();

    // Inicializamos el gráfico con un pequeño delay para que tome el tamaño correcto
    setTimeout(() => {
        initChart();
    }, 200);
};
