const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes ici
app.use('/api/patients', require('./routes/patientRoutes.js'));
app.use('/api/medecins', require('./routes/medecinRoutes.js'));
app.use('/api/assistants', require('./routes/assistantRoutes.js'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patient', require('./routes/patientDashboard'));
app.use('/api/medical', require('./routes/medicalRecordRoutes'));
app.use('/api/orthanc', require('./routes/orthancRoutes'));

module.exports = app;
