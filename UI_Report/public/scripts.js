document.addEventListener('DOMContentLoaded', () => {
    const radioList = document.getElementById('radio-list');
    const nextButton = document.getElementById('next-button');
    const applicationSelectDiv = document.getElementById('application-select');
    const qualityMetricsDiv = document.getElementById('quality-metrics');
    const metricsList = document.getElementById('metrics-list');
    const backButton = document.getElementById('back-button');

    let chosenApplication = '';

    // Fetch applications from the server
    async function fetchApplications() {
        try {
            const response = await fetch('http://localhost:5050/api/data');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            populateApplications(data);
            console.log("Applications data", data);
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    }

    // Populate the radio list with applications
    function populateApplications(data) {
        const filteredApplications = data.filter(app => app.schema && app.schema.endsWith('_central'))
                                         .map(app => ({ name: app.name, displayName: app.schema.replace('_central', '') }));

        filteredApplications.forEach(application => {
            const label = document.createElement('label');
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'application';
            radio.value = application.name;
            label.appendChild(radio);
            label.appendChild(document.createTextNode(application.displayName));
            radioList.appendChild(label);
            radioList.appendChild(document.createElement('br')); // Add a line break for each application
        });
    }

    // Show the quality metrics
    function showQualityMetrics() {
        const selectedApplication = document.querySelector('input[name="application"]:checked');
        
        if (!selectedApplication) {
            alert('Please select an application.');
            return;
        }

        // Health Measures list
        const HealthMeasures = [
            'Total Quality Index',
            'Changeability',
            'Transferability',
            'Documentation',
            'Robustness',
            'Programming Practices',
            'Security',
            'Architectural Design',
            'Efficiency'
        ];

        chosenApplication = selectedApplication.value; // Store the selected application name
        console.log('Selected Application:', chosenApplication);

        fetchQualityMetrics(chosenApplication, HealthMeasures);
    }

    // Fetch quality metrics from the server
    async function fetchQualityMetrics(chosenApplication, HealthMeasures) {
        try {
            const response = await fetch(`/api/qualityMetrics/TQI?application=${chosenApplication}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Quality Metrics TQI:', data);
            displayQualityMetrics(HealthMeasures);
        } catch (error) {
            console.error('Error fetching quality metrics:', error);
            displayQualityMetrics(HealthMeasures); // Still display HealthMeasures on error
        }
    }

    // Display quality metrics
    function displayQualityMetrics(HealthMeasures) {
        metricsList.innerHTML = '';
        
        HealthMeasures.forEach(measure => {
            const div = document.createElement('div');
            div.textContent = measure;
            div.className = 'metric-item';
            div.addEventListener('click', () => openStaticPage(measure));
            metricsList.appendChild(div);
        });

        // Show quality metrics and hide application selection
        applicationSelectDiv.style.display = 'none';
        qualityMetricsDiv.style.display = 'block';
    }

    // Open a static page with a demo message
    function openStaticPage(measure) {
        window.location.href = `HealthMeasure.html?measure=${encodeURIComponent(measure)}`;
    }
    
    // Go back to the application selection
    function goBack() {
        applicationSelectDiv.style.display = 'block';
        qualityMetricsDiv.style.display = 'none';
    }

    // Event listeners
    nextButton.addEventListener('click', showQualityMetrics);
    backButton.addEventListener('click', goBack);

    // Initialize the application select
    fetchApplications();
});
