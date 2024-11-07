document.addEventListener("DOMContentLoaded", () => {
    const patientList = document.getElementById("patientList");
    const patientDetailsContainer = document.querySelector(".patient-details");
    const diagnosisContainer = document.querySelector(".diagnosis .vitals");
    let bpChart;

    // Initialize or update the BP chart
    function updateBpChart(systolicData, diastolicData) {
        const ctx = document.getElementById("bpChart").getContext("2d");

        // Destroy the previous chart instance if it exists to prevent overlapping
        if (bpChart) {
            bpChart.destroy();
        }

        // Create a new chart instance with updated data
        bpChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"], // Example labels
                datasets: [
                    {
                        label: "Systolic",
                        data: systolicData,
                        borderColor: "#ff6384",
                        backgroundColor: "rgba(255, 99, 132, 0.2)",
                        fill: true
                    },
                    {
                        label: "Diastolic",
                        data: diastolicData,
                        borderColor: "#36a2eb",
                        backgroundColor: "rgba(54, 162, 235, 0.2)",
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        position: "top"
                    }
                }
            }
        });
    }

    // Function to update patient details, BP chart, and display current BP
    function displayPatientDetails(patient) {
        patientDetailsContainer.innerHTML = `
            <img src="${patient.imageUrl}" alt="${patient.name}" class="profile-pic">
            <h3>${patient.name}</h3>
            <p>Date of Birth: ${patient.dob}</p>
            <p>Gender: ${patient.gender}</p>
            <p>Contact Info: ${patient.contact}</p>
        `;

        diagnosisContainer.innerHTML = `
            <div class="vital"><h4>Respiratory Rate</h4><p>${patient.diagnosis.respiratoryRate}</p></div>
            <div class="vital"><h4>Temperature</h4><p>${patient.diagnosis.temperature}</p></div>
            <div class="vital"><h4>Heart Rate</h4><p>${patient.diagnosis.heartRate}</p></div>
        `;

        // Update the BP chart data
        const systolicData = patient.diagnosis.systolicBP;
        const diastolicData = patient.diagnosis.diastolicBP;
        updateBpChart(systolicData, diastolicData);

        // Display current systolic and diastolic values next to the chart
        const currentBpContainer = document.getElementById("currentBpData");
        currentBpContainer.innerHTML = `
            <h4>Current Blood Pressure</h4>
            <p><strong>Systolic:</strong> ${systolicData[systolicData.length - 1]} mmHg</p>
            <p><strong>Diastolic:</strong> ${diastolicData[diastolicData.length - 1]} mmHg</p>
        `;
    }

    // Fetch patient data from db.json
    async function fetchPatientData() {
        try {
            const response = await fetch("db.json");
            const data = await response.json();
            displayPatientList(data.patients);
        } catch (error) {
            console.error("Error fetching patient data:", error);
        }
    }

    // Display patient list in the sidebar
    function displayPatientList(patients) {
        const patientList = document.querySelector(".patient-list ul");
        patients.forEach(patient => {
            const listItem = document.createElement("li");
            listItem.classList.add("patient");
            listItem.innerHTML = `
                <img src="${patient.imageUrl}" alt="${patient.name}">
                <span>${patient.name}, ${patient.age}</span>
            `;
            listItem.addEventListener("click", () => displayPatientDetails(patient));
            patientList.appendChild(listItem);
        });
    }

    // Initial fetch and display of patient data
    fetchPatientData();
});
