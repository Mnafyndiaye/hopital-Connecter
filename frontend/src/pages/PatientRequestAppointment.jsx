import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
  Paper,
} from '@mui/material';
import PatientSidebar from '../components/PatientSidebar';

const PatientRequestAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [patientId, setPatientId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const resDoctors = await axios.get('http://localhost:5000/api/medecins', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctors(resDoctors.data);

        const resPatient = await axios.get('http://localhost:5000/api/patient/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatientId(resPatient.data.id);
      } catch (err) {
        console.error('Erreur chargement :', err.response?.data || err.message);
        setMessage("❌ Erreur lors du chargement des données.");
      }
    };
    fetchData();
  }, []);

  // Auto-hide alert after 4 seconds
  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => setMessage(''), 4000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');

    if (!selectedDoctorId || !date || !time || !reason || !patientId) {
      setMessage("❌ Veuillez remplir tous les champs.");
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/rendezvous',
        {
          patientId,
          medecinId: selectedDoctorId,
          date: `${date}T${time}`,
          motif: reason,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage('✅ Demande de rendez-vous envoyée avec succès.');
      setSelectedDoctorId('');
      setDate('');
      setTime('');
      setReason('');
    } catch (err) {
      console.error("❌ Erreur lors de l'envoi :", err.response?.data || err.message);
      setMessage("❌ Une erreur est survenue lors de l'envoi.");
    }
  };

  return (
    <Box display="flex">
      <PatientSidebar />
      <Box flex={1} p={4}>
        <Typography variant="h5" gutterBottom>
          Demande de rendez-vous
        </Typography>

        <Paper elevation={3} sx={{ p: 3, maxWidth: 500 }}>
          <TextField
            fullWidth
            select
            label="Médecin"
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            margin="normal"
          >
            <MenuItem value="">-- Choisir un médecin --</MenuItem>
            {doctors.map((doc) => (
              <MenuItem key={doc.id} value={doc.id}>
                Dr {doc.prenom} {doc.nom}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            type="date"
            label="Date"
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            margin="normal"
          />

          <TextField
            fullWidth
            type="time"
            label="Heure"
            InputLabelProps={{ shrink: true }}
            value={time}
            onChange={(e) => setTime(e.target.value)}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Motif"
            multiline
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            margin="normal"
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
            sx={{ mt: 2 }}
          >
            Envoyer la demande
          </Button>

          {message && (
            <Alert
              key={message}
              severity={message.startsWith('✅') ? 'success' : 'error'}
              sx={{ mt: 2 }}
            >
              {message}
            </Alert>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default PatientRequestAppointment;
