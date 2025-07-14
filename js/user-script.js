document.addEventListener("DOMContentLoaded", function () {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const username = localStorage.getItem("loggedInUser");

  if (isLoggedIn === "true" && username) {
    const nameSpan = document.getElementById("current-user-name");
    if (nameSpan) {
      nameSpan.textContent = username;
    }

    const helloHeading = document.querySelector("header h2");
    if (helloHeading) {
      helloHeading.textContent = `Hello, ${username}!`;
    }
  } else {
    window.location.href = "login.html";
  }

  const mockData = {
    users: [
      {
        userId: "U001",
        username: "nguyenvana",
        password: "123321",
        email: "a@example.com",
        phoneNumber: "0912345678",
        gender: "Nam",
        dob: "1990-01-15",
        role: "admin",
      },
      {
        userId: "U002",
        username: "tranthib",
        password: "123321",
        email: "b@example.com",
        phoneNumber: "0987654321",
        gender: "Nữ",
        dob: "1995-05-20",
        role: "user",
      },
      {
        userId: "U003",
        username: "lehuuc",
        password: "123321",
        email: "c@example.com",
        phoneNumber: "0905558888",
        gender: "Nam",
        dob: "1988-11-30",
        role: "user",
      },
    ],
    metricTypes: [
      { metricId: "M01", name: "Nhịp tim", unit: "bpm" },
      { metricId: "M02", name: "Huyết áp", unit: "mmHg" },
      { metricId: "M03", name: "Nồng độ Oxy", unit: "%" },
      { metricId: "M04", name: "Số bước chân", unit: "bước" },
    ],
    dailyLogs: [
      {
        logId: "L001",
        userId: "U001",
        logDate: "2025-07-05",
        note: "Cảm thấy khỏe.",
      },
      {
        logId: "L002",
        userId: "U002",
        logDate: "2025-07-05",
        note: "Bình thường.",
      },
      {
        logId: "L003",
        userId: "U001",
        logDate: "2025-07-06",
        note: "Hơi mệt.",
      },
      {
        logId: "L004",
        userId: "U003",
        logDate: "2025-07-06",
        note: "Đi bộ 5000 bước.",
      },
    ],
    healthRecords: [
      {
        healthRecordId: "HR001",
        logId: "L001",
        metricTypeId: "M01",
        value: "75",
      },
      {
        healthRecordId: "HR002",
        logId: "L001",
        metricTypeId: "M02",
        value: "120/80",
      },
      {
        healthRecordId: "HR003",
        logId: "L002",
        metricTypeId: "M01",
        value: "80",
      },
      {
        healthRecordId: "HR004",
        logId: "L003",
        metricTypeId: "M01",
        value: "90",
      },
      {
        healthRecordId: "HR005",
        logId: "L004",
        metricTypeId: "M04",
        value: "5120",
      },
    ],
    targets: [
      {
        targetId: "T01",
        userId: "U001",
        title: "Giảm huyết áp",
        status: "In Progress",
        startDate: "2025-07-01",
        endDate: "2025-07-31",
      },
      {
        targetId: "T02",
        userId: "U003",
        title: "Đi bộ mỗi ngày",
        status: "Completed",
        startDate: "2025-06-01",
        endDate: "2025-06-30",
      },
    ],
  };
  const dialog = document.getElementById("dailyLogDialog");
  const openBtn = document.getElementById("openLogDialogBtn");
  const closeBtn = document.getElementById("closeLogDialogBtn");

  openBtn.addEventListener("click", () => dialog.showModal());
  closeBtn.addEventListener("click", () => dialog.close());

  // Submit button logic (add to table or backend call)
  document
    .getElementById("submitLogBtn")
    .addEventListener("click", function () {
      // TODO: Validate + save data
      dialog.close();
    });

  function renderAllTables() {
    const dummyHealthData = {
      heartRate: 72,
      bloodPressure: "120/80",
      weight: 68,
      sleepTime: "8h",
    };

    renderData(dummyHealthData);
    renderDailyLogTable();
    renderTargetList(); // Ensure this is called to populate the target list if needed

    // There's no "addTargetBtn" in the HTML for the "Add Target" section.
    // The HTML form has a "submit-btn" instead.
    const submitTargetBtn = document.querySelector("#target .submit-btn");
    if (submitTargetBtn) {
      submitTargetBtn.addEventListener("click", handleAddTarget);
    }

    const filterSelect = document.getElementById("target-filter");
    if (filterSelect) {
      filterSelect.addEventListener("change", renderTargetList);
    }

    const submitLogBtn = document.getElementById("submitLogBtn");
    if (submitLogBtn) {
      submitLogBtn.addEventListener("click", submitDailyLog);
    }
  }

  function renderData(healthData) {
    if (!healthData) {
      console.warn("healthData is undefined");
      return;
    }

    const heartRateEl = document.getElementById("heart-rate");
    if (heartRateEl) heartRateEl.textContent = `${healthData.heartRate} bpm`;

    const bloodPressureEl = document.getElementById("blood-pressure");
    if (bloodPressureEl) bloodPressureEl.textContent = healthData.bloodPressure;

    const weightEl = document.getElementById("weight");
    if (weightEl) weightEl.textContent = `${healthData.weight} kg`;

    const sleepTimeEl = document.getElementById("sleep-time");
    if (sleepTimeEl) sleepTimeEl.textContent = healthData.sleepTime;
  }

  function renderDailyLogTable() {
    const username = localStorage.getItem("loggedInUser");
    const currentUser = mockData.users.find((u) => u.username === username);
    if (!currentUser) return;

    // The HTML has id="dailyLogTableBody", not "daily-log-table-body"
    const tableBody = document.getElementById("dailyLogTableBody");
    if (!tableBody) return;

    const logs = mockData.dailyLogs.filter(
      (log) => log.userId === currentUser.userId
    );

    tableBody.innerHTML = "";
    logs.forEach((log) => {
      const row = document.createElement("tr");
      // You might want to display more log details here.
      // Currently, dailyLogs in mockData only have logDate and note.
      row.innerHTML = `
                <td>${log.logDate}</td>
                <td>N/A</td> <td>N/A</td> <td>N/A</td> <td>N/A</td> <td>N/A</td> <td>N/A</td> <td>${log.note}</td>
                <td>
                    <button class="btn btn-primary btn-sm edit-log-btn" data-id="${log.logId}">Sửa</button>
                    <button class="btn btn-danger btn-sm delete-log-btn" data-id="${log.logId}">Xóa</button>
                </td>
            `;
      tableBody.appendChild(row);
    });
  }

  function submitDailyLog() {
    const logData = {
      date: document.getElementById("logDate").value,
      sleepStart: document.getElementById("sleepStart").value,
      sleepEnd: document.getElementById("sleepEnd").value,
      weight: parseFloat(document.getElementById("weight").value),
      exerciseTime: parseInt(document.getElementById("exerciseTime").value),
      healthMetricType: document.getElementById("metricType").value,
      metricValue: document.getElementById("metricValue").value,
      notes: document.getElementById("logNotes").value,
    };

    console.log("Log data submitted:", logData);

    // For now, we'll just add to mockData for demonstration
    const username = localStorage.getItem("loggedInUser");
    const currentUser = mockData.users.find((u) => u.username === username);
    if (!currentUser) {
      alert("User not found.");
      return;
    }

    const newLog = {
      logId: "L" + Math.floor(Math.random() * 100000),
      userId: currentUser.userId,
      logDate: logData.date,
      note: logData.notes,
      // You might want to add sleepStart, sleepEnd, weight, exerciseTime here
      // based on how your dailyLogs structure is designed to hold this info
    };
    mockData.dailyLogs.push(newLog);

    if (logData.healthMetricType && logData.metricValue) {
      const metricType = mockData.metricTypes.find(
        (m) => m.name === logData.healthMetricType
      );
      if (metricType) {
        const newHealthRecord = {
          healthRecordId: "HR" + Math.floor(Math.random() * 100000),
          logId: newLog.logId,
          metricTypeId: metricType.metricId,
          value: logData.metricValue,
        };
        mockData.healthRecords.push(newHealthRecord);
      } else {
        alert("Metric type not found. Please add a valid metric type.");
      }
    }

    alert("Log submitted successfully!");
    renderDailyLogTable(); // Re-render the table after adding a new log
    // Clear the form
    document.getElementById("dailyLogForm").reset();
  }

  function renderTargetList() {
    const username = localStorage.getItem("loggedInUser");
    const currentUser = mockData.users.find((u) => u.username === username);
    if (!currentUser) return;

    // The HTML for targets does not have a table, it has a form.
    // It seems the `renderTargetList` function is intended to render targets on another section
    // or this `section id="target"` is just for adding targets.
    // The original script has `target-table-body` but there's no such table in the HTML provided for #target.
    // Assuming this function is meant to render targets in a separate "Progress Record" section.
    // Since the request is to get the "Add Target" section to appear, we'll focus on that.
    // If there's another section where targets should be listed, that HTML isn't provided here.
    console.log(
      "renderTargetList called. Currently, the HTML provided for 'Add Target' does not include a table to render a list of targets."
    );
  }

  function handleAddTarget() {
    const username = localStorage.getItem("loggedInUser");
    const currentUser = mockData.users.find((u) => u.username === username);
    if (!currentUser) return;

    const targetTitle = document.getElementById("targetTitle").value;
    const startTimeHour = document.querySelector(
      "#target .time-inputs input:nth-child(1)"
    ).value;
    const startTimeMinute = document.querySelector(
      "#target .time-inputs input:nth-child(2)"
    ).value;
    const startDate = document.querySelector(
      "#target .time-inputs input:nth-child(3)"
    ).value;
    const finishDate = document.querySelector(
      "#target label:nth-of-type(4) + input"
    ).value; // Selects the date input after "Finish time" label
    const targetDesc = document.getElementById("targetDesc").value;

    // Simple validation
    if (!targetTitle || !startDate || !finishDate || !targetDesc) {
      alert("Please fill in all target fields.");
      return;
    }

    const newTarget = {
      targetId: "T" + Math.floor(Math.random() * 100000),
      userId: currentUser.userId,
      title: targetTitle,
      description: targetDesc, // Added description
      status: "In Progress", // Default status
      startDate: startDate,
      endDate: finishDate,
      startTime: `${startTimeHour || "00"}:${startTimeMinute || "00"}`, // Include time if provided
    };

    mockData.targets.push(newTarget);
    alert("Target added successfully!");
    console.log("New Target added:", newTarget);

    // Reset form (you'll need to clear each input manually)
    document.getElementById("targetTitle").value = "";
    document.querySelector("#target .time-inputs input:nth-child(1)").value =
      "";
    document.querySelector("#target .time-inputs input:nth-child(2)").value =
      "";
    document.querySelector("#target .time-inputs input:nth-child(3)").value =
      "";
    document.querySelector("#target label:nth-of-type(4) + input").value = "";
    document.getElementById("targetDesc").value = "";

    // If you had a list of targets to render, you'd call renderTargetList() here.
    // Based on current HTML for #target, it's only for adding, not listing.
  }

  // --- XỬ LÝ SỰ KIỆN KHÁC ---

  document.getElementById("logout-btn").addEventListener("click", () => {
    if (confirm("Bạn có muốn đăng xuất không?")) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("loggedInUser");
      window.location.href = "login.html";
    }
  });

  // Chuyển tab - Đã sửa đổi để khớp data-target="targets" với section id="target"
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      // Remove active class from current active nav link
      const currentActiveNavLink = document.querySelector(".nav-link.active");
      if (currentActiveNavLink) {
        currentActiveNavLink.classList.remove("active");
      }
      // Add active class to clicked nav link
      link.classList.add("active");

      // Remove active class from current active content section
      const currentActiveContentSection = document.querySelector(
        ".content-section.active"
      );
      if (currentActiveContentSection) {
        currentActiveContentSection.classList.remove("active");
      }

      // Get the target ID from data-target attribute
      let targetId = link.getAttribute("data-target");

      // Special handling for "targets" to map to "target" section ID
      if (targetId === "targets") {
        targetId = "target"; // Map "targets" from nav-link to "target" section ID
      }

      // Add active class to the corresponding content section
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.add("active");
      } else {
        console.warn(`Section with ID "${targetId}" not found.`);
      }
    });
  });

  // Function to render health records (not directly asked but good to have)
  function renderHealthRecordsTable() {
    const username = localStorage.getItem("loggedInUser");
    const currentUser = mockData.users.find((u) => u.username === username);
    if (!currentUser) return;

    const tableBody = document.getElementById("recordTableBody");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    const userLogs = mockData.dailyLogs.filter(
      (log) => log.userId === currentUser.userId
    );

    userLogs.forEach((log) => {
      const relatedHealthRecords = mockData.healthRecords.filter(
        (hr) => hr.logId === log.logId
      );
      let overview = log.note; // Start with the log note

      if (relatedHealthRecords.length > 0) {
        overview += " - Metrics: ";
        relatedHealthRecords.forEach((hr) => {
          const metricType = mockData.metricTypes.find(
            (mt) => mt.metricId === hr.metricTypeId
          );
          if (metricType) {
            overview += `${metricType.name}: ${hr.value}${
              metricType.unit ? " " + metricType.unit : ""
            }; `;
          }
        });
      }

      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${log.logDate}</td>
                <td>${overview}</td>
                <td>
                    <button class="btn btn-primary btn-sm edit-record-btn" data-log-id="${log.logId}">Sửa</button>
                    <button class="btn btn-danger btn-sm delete-record-btn" data-log-id="${log.logId}">Xóa</button>
                </td>
            `;
      tableBody.appendChild(row);
    });

    // Add event listeners for edit/delete buttons if you want to implement that functionality
  }

  // Function to filter records (called when filter button is clicked)
  window.filterRecords = function () {
    // Make it global so it can be called from onclick
    const filterDate = document.getElementById("filterDate").value;
    const filterType = document
      .getElementById("filterType")
      .value.toLowerCase();

    const tableBody = document.getElementById("recordTableBody");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    const username = localStorage.getItem("loggedInUser");
    const currentUser = mockData.users.find((u) => u.username === username);
    if (!currentUser) return;

    const userLogs = mockData.dailyLogs.filter(
      (log) => log.userId === currentUser.userId
    );

    userLogs.forEach((log) => {
      const relatedHealthRecords = mockData.healthRecords.filter(
        (hr) => hr.logId === log.logId
      );
      let overview = log.note;
      let recordMatchesFilter = false;

      if (filterDate && log.logDate !== filterDate) {
        return; // Skip if date doesn't match
      }

      if (relatedHealthRecords.length > 0) {
        let metricsOverview = " - Metrics: ";
        relatedHealthRecords.forEach((hr) => {
          const metricType = mockData.metricTypes.find(
            (mt) => mt.metricId === hr.metricTypeId
          );
          if (metricType) {
            metricsOverview += `${metricType.name}: ${hr.value}${
              metricType.unit ? " " + metricType.unit : ""
            }; `;
            if (
              filterType &&
              metricType.name.toLowerCase().includes(filterType)
            ) {
              recordMatchesFilter = true;
            }
          }
        });
        overview += metricsOverview;
      }

      // If a filter type is provided, and no health record matches, skip
      if (
        filterType &&
        !recordMatchesFilter &&
        relatedHealthRecords.length > 0
      ) {
        // If there are health records but none match the filterType,
        // and the main log note itself doesn't contain the filter type, then skip.
        if (!log.note.toLowerCase().includes(filterType)) {
          return;
        }
      } else if (
        filterType &&
        relatedHealthRecords.length === 0 &&
        !log.note.toLowerCase().includes(filterType)
      ) {
        // If there are no health records and the log note doesn't match, skip
        return;
      }

      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${log.logDate}</td>
                <td>${overview}</td>
                <td>
                    <button class="btn btn-primary btn-sm edit-record-btn" data-log-id="${log.logId}">Sửa</button>
                    <button class="btn btn-danger btn-sm delete-record-btn" data-log-id="${log.logId}">Xóa</button>
                </td>
            `;
      tableBody.appendChild(row);
    });
  };
  

  // --- KHỞI TẠO ---
  renderAllTables();
  renderHealthRecordsTable(); // Call this to render the health records on initial load
});
