import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Grid,
  Divider,
} from '@mui/material';
import AssistantSidebar from '../components/AssistantSidebar';

const AssistantAppointmentDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [selectedMedecinId, setSelectedMedecinId] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAppointments();
    fetchMedecins();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/rendezvous/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (error) {
      console.error('Erreur chargement des rendez-vous :', error);
    }
  };

  const fetchMedecins = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/medecins', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedecins(res.data);
    } catch (error) {
      console.error('Erreur chargement des médecins :', error);
    }
  };

  const handleAssign = async () => {
    if (!selectedAppointment || !newDate || !newTime || !selectedMedecinId) return;

    try {
      const scheduledDate = `${newDate}T${newTime}`;
      await axios.put(
        `http://localhost:5000/api/rendezvous/${selectedAppointment.id}/schedule`,
        {
          date: scheduledDate,
          medecinId: selectedMedecinId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedAppointment(null);
      setNewDate('');
      setNewTime('');
      setSelectedMedecinId('');
      fetchAppointments();
    } catch (error) {
      console.error('Erreur programmation rendez-vous:', error);
    }
  };

  return (
    <Box display="flex">
      <AssistantSidebar />
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Rendez-vous à programmer
        </Typography>

        {appointments.length === 0 ? (
          <Typography>Aucun rendez-vous en attente.</Typography>
        ) : (
          <Grid container spacing={2}>
            {appointments.map((rdv) => (
              <Grid item xs={12} md={6} key={rdv.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography><strong>Patient:</strong> {rdv.patient?.firstName} {rdv.patient?.lastName}</Typography>
                    <Typography><strong>Médecin:</strong> {rdv.medecin?.prenom} {rdv.medecin?.nom}</Typography>
                    <Typography><strong>Motif:</strong> {rdv.motif}</Typography>
                    <Typography><strong>Date actuelle:</strong> {new Date(rdv.date).toLocaleString()}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button variant="contained" color="primary" onClick={() => setSelectedAppointment(rdv)}>
                      Programmer
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {selectedAppointment && (
          <Box mt={4}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h5" gutterBottom>Programmer le rendez-vous</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date"
                  InputLabelProps={{ shrink: true }}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="Heure"
                  InputLabelProps={{ shrink: true }}
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Médecin</InputLabel>
                  <Select
                    value={selectedMedecinId}
                    label="Médecin"
                    onChange={(e) => setSelectedMedecinId(e.target.value)}
                  >
                    {medecins.map((m) => (
                      <MenuItem key={m.id} value={m.id}>
                        Dr {m.prenom} {m.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="success" onClick={handleAssign}>
                  Confirmer
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default AssistantAppointmentDashboard;
