const METRIC_TYPES = {
  weight: {
    name: "Weight",
    unit: "kg",
    icon: "fas fa-weight",
    color: "#3498db",
    normalRange: { min: 50, max: 100 },
  },
  height: {
    name: "Height",
    unit: "cm",
    icon: "fas fa-height",
    color: "#2ecc71",
    normalRange: { min: 150, max: 200 },
  },
  heartRate: {
    name: "Heart Rate",
    unit: "bpm",
    icon: "fas fa-heartbeat",
    color: "#e74c3c",
    normalRange: { min: 60, max: 100 },
  },
  bloodPressure: {
    name: "Blood Pressure",
    unit: "mmHg",
    icon: "fas fa-thermometer-half",
    color: "#f39c12",
    normalRange: {
      systolic: { min: 90, max: 140 },
      diastolic: { min: 60, max: 90 },
    },
  },
  bloodSugar: {
    name: "Blood Sugar",
    unit: "mg/dL",
    icon: "fas fa-tint",
    color: "#9b59b6",
    normalRange: { min: 70, max: 140 },
  },
  steps: {
    name: "Steps",
    unit: "steps",
    icon: "fas fa-walking",
    color: "#1abc9c",
    normalRange: { min: 5000, max: 15000 },
  },
  temperature: {
    name: "Body Temperature",
    unit: "°C",
    icon: "fas fa-thermometer-half",
    color: "#e67e22",
    normalRange: { min: 36, max: 37.5 },
  },
  sleep: {
    name: "Sleep Hours",
    unit: "hours",
    icon: "fas fa-bed",
    color: "#34495e",
    normalRange: { min: 6, max: 9 },
  },
};

/**
 * Generate comprehensive mock data for demonstration
 * Creates realistic health data spanning the last 30 days
 */
function initializeMockData() {
  console.log("Generating mock health data...");

  const mockData = [];
  const now = new Date();

  // Generate data for the last 30 days
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Weight data (gradual decrease trend)
    if (Math.random() > 0.3) {
      mockData.push({
        id: Date.now() + Math.random() * 1000,
        type: "weight",
        value: (75 - i * 0.1 + (Math.random() * 2 - 1)).toFixed(1),
        date: date.toISOString().split("T")[0],
        time: "08:00",
        notes: i === 30 ? "Starting weight" : i === 0 ? "Current weight" : "",
        timestamp: date.getTime(),
      });
    }

    // Height data (stable)
    if (i === 30 || i === 15 || i === 0) {
      mockData.push({
        id: Date.now() + Math.random() * 1000,
        type: "height",
        value: (175 + Math.random() * 2 - 1).toFixed(1),
        date: date.toISOString().split("T")[0],
        time: "09:00",
        notes: "Height measurement",
        timestamp: date.getTime(),
      });
    }

    // Heart rate data (varies throughout day)
    if (Math.random() > 0.4) {
      const baseHeartRate = 72;
      const variation = Math.random() * 20 - 10;
      mockData.push({
        id: Date.now() + Math.random() * 1000,
        type: "heartRate",
        value: Math.round(baseHeartRate + variation),
        date: date.toISOString().split("T")[0],
        time: `${8 + Math.floor(Math.random() * 12)}:${Math.floor(
          Math.random() * 60
        )
          .toString()
          .padStart(2, "0")}`,
        notes: Math.random() > 0.8 ? "After exercise" : "",
        timestamp: date.getTime() + Math.random() * 86400000,
      });
    }

    // Blood pressure data (weekly measurements)
    if (i % 7 === 0) {
      const systolic = 120 + Math.floor(Math.random() * 20 - 10);
      const diastolic = 80 + Math.floor(Math.random() * 10 - 5);
      mockData.push({
        id: Date.now() + Math.random() * 1000,
        type: "bloodPressure",
        value: `${systolic}/${diastolic}`,
        date: date.toISOString().split("T")[0],
        time: "09:00",
        notes: "Weekly check",
        timestamp: date.getTime(),
      });
    }

    // Steps data (daily)
    if (Math.random() > 0.2) {
      const steps = 5000 + Math.floor(Math.random() * 8000);
      mockData.push({
        id: Date.now() + Math.random() * 1000,
        type: "steps",
        value: steps,
        date: date.toISOString().split("T")[0],
        time: "23:59",
        notes:
          steps > 10000
            ? "Great day!"
            : steps < 6000
            ? "Need more activity"
            : "",
        timestamp: date.getTime(),
      });
    }

    // Sleep data (daily)
    if (Math.random() > 0.2) {
      const sleepHours = 6.5 + Math.random() * 2.5;
      mockData.push({
        id: Date.now() + Math.random() * 1000,
        type: "sleep",
        value: sleepHours.toFixed(1),
        date: date.toISOString().split("T")[0],
        time: "07:00",
        notes:
          sleepHours < 7 ? "Poor sleep" : sleepHours > 8.5 ? "Great sleep" : "",
        timestamp: date.getTime(),
      });
    }

    // Temperature data (occasional)
    if (Math.random() > 0.9) {
      const temp = 36.5 + Math.random() * 1.5;
      mockData.push({
        id: Date.now() + Math.random() * 1000,
        type: "temperature",
        value: temp.toFixed(1),
        date: date.toISOString().split("T")[0],
        time: "18:00",
        notes: temp > 37.5 ? "Feeling unwell" : "Routine check",
        timestamp: date.getTime(),
      });
    }
  }

  // Sort by timestamp
  healthData = mockData.sort((a, b) => a.timestamp - b.timestamp);

  // Initialize some sample goals
  goals = {
    weight: 70,
    height: 175,
    heartRate: 75,
    bloodPressure: "120/80",
    steps: 10000,
    sleep: 8,
  };

  // Save to localStorage
  saveData();

  console.log(`Generated ${healthData.length} mock health records`);
}
