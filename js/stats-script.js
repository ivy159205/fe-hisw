function generateLabels(timeRange, count) {
  switch (timeRange) {
    case "day":
      return Array.from({ length: count }, (_, i) => `Day ${i + 1}`);
    case "week":
      return Array.from({ length: count }, (_, i) => `Week ${i + 1}`);
    case "month":
      return [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ].slice(0, count);
  }
}

function getColor(index) {
  const colors = [
    "#4BC0C0",
    "#FF6384",
    "#FFCE56",
    "#36A2EB",
    "#9966FF",
    "#8BC34A",
    "#FF9F40",
  ];
  return colors[index % colors.length];
}

function renderAllCharts(timeRange) {
  const chartTitles = [
    "Weight (kg)",
    "Height (cm)",
    "Steps (steps)",
    "Heart Rate (bpm)",
    "Blood Sugar (mg/dL)",
    "Blood Pressure (mmHg)",
    "Sleep Hours",
  ];

  const container = document.getElementById("chartsContainer");
  container.innerHTML = "";

  chartTitles.forEach((title, index) => {
    const count = timeRange === "month" ? 12 : 7;
    const labels = generateLabels(timeRange, count);

    // Fake data ranges per metric
    const ranges = [
      [50, 90], // Weight
      [170, 190], // Height
      [100, 10000], // Steps
      [60, 100], // Heart Rate
      [70, 160], // Blood Sugar
      [90, 140], // Blood Pressure
      [4, 9], // Sleep
      [36, 38], // Temperature
    ];
    const [min, max] = ranges[index];
    const data = Array.from(
      { length: count },
      () => +(Math.random() * (max - min) + min).toFixed(1)
    );

    const chartWrapper = document.createElement("div");
    chartWrapper.classList.add("canvas-container");

    const chartTitle = document.createElement("h5");
    chartTitle.textContent = title;
    chartWrapper.appendChild(chartTitle);

    const canvas = document.createElement("canvas");
    chartWrapper.appendChild(canvas);
    container.appendChild(chartWrapper);

    const ctx = canvas.getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: title,
            data: data,
            backgroundColor: getColor(index),
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  });
}

document.getElementById("timeFilter").addEventListener("change", function () {
  renderAllCharts(this.value);
});

// Initial render
renderAllCharts("day");
