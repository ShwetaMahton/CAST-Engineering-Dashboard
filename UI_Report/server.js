const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');

const API_URL = 'http://localhost:8087/rest';
const USERNAME = 'admin';
const PASSWORD = 'admin';

// Enable CORS for all requests
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Function to fetch data from the API
async function fetchData() {
    try {
        const response = await axios.get(API_URL, {
            auth: {
                username: USERNAME,
                password: PASSWORD
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error;
    }
}

// Function to fetch quality metrics from the API
async function fetchQualityMetrics(application) {
    const url = `${API_URL}/${application}/quality-indicators/60017/snapshots/1`;
    console.log('Fetching Quality Metrics from URL:', url);
    
    try {
        const response = await axios.get(url, {
            auth: {
                username: USERNAME,
                password: PASSWORD
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching quality metrics:', error.message);
        throw error;
    }
}

// Proxy endpoint to fetch applications from the API
app.get('/api/data', async (req, res) => {
    try {
        const data = await fetchData();
        res.json(data);
        console.log("Applications", data)
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

// Proxy endpoint to fetch quality metrics based on selected application
app.get('/api/qualityMetrics/TQI', async (req, res) => {
    const { application } = req.query;
    try {
        const data = await fetchQualityMetrics(application);
        res.json(data);
        console.log(`Quality Metrics TQI for ${application}`, data)
    } catch (error) {
        res.status(500).send('Error fetching quality metrics');
    }
});

// Start the server on port 5050
app.listen(5050, () => {
    console.log('Server is running on http://localhost:5050');
});
