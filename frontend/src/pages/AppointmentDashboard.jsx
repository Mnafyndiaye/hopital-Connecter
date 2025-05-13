import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Card, CardContent, CircularProgress, Grid } from '@mui/material';
import PatientSidebar from '../components/PatientSidebar';
import MedecinSidebar from '../components/MedecinSidebar';

const AppointmentDashboard = ({ role }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const route = getAppointmentRoute(role);

      const res = await axios.get(`http://localhost:5000${route}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppointments(res.data);
    } catch (error) {
      console.error('Erreur chargement rendez-vous :', error);
    } finally {
      setLoading(false);
    }
  };

  const getAppointmentRoute = (role) => {
    switch (role) {
      case 'patient': return '/api/rendezvous/patient/me';
      case 'medecin': return '/api/rendezvous/medecin';
      default: return '/api/rendezvous';
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/rendezvous/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments();
    } catch (error) {
      console.error('Erreur mise à jour statut :', error);
    }
  };

  const handleRequestAppointment = () => {
    navigate('/patient/request-appointment');
  };

  return (
    <Box display="flex">
      {role === 'patient' && <PatientSidebar />}
      {role === 'medecin' && <MedecinSidebar />}

      <Box flex={1} p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">
            Mes Rendez-vous
          </Typography>
          {role === 'patient' && (
            <Button variant="contained" color="primary" onClick={handleRequestAppointment}>
              Demander un rendez-vous
            </Button>
          )}
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
            <CircularProgress />
          </Box>
        ) : appointments.length === 0 ? (
          <Typography>Aucun rendez-vous trouvé.</Typography>
        ) : (
          <Grid container spacing={2}>
            {appointments.map((rendezvous) => (
              <Grid item xs={12} md={6} lg={4} key={rendezvous.id}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography><strong>Date :</strong> {format(new Date(rendezvous.date), 'dd/MM/yyyy HH:mm')}</Typography>
                    <Typography><strong>Motif :</strong> {rendezvous.motif}</Typography>
                    <Typography><strong>Statut :</strong> {rendezvous.status}</Typography>
                    <Typography><strong>Médecin :</strong> {rendezvous.medecin?.firstName} {rendezvous.medecin?.lastName}</Typography>
                    <Typography><strong>Patient :</strong> {rendezvous.patient?.firstName} {rendezvous.patient?.lastName}</Typography>

                    {role === 'medecin' && (
                      <Box mt={2} display="flex" gap={1}>
                        {rendezvous.status === 'planifié' && (
                          <Button variant="contained" color="success" onClick={() => handleStatusChange(rendezvous.id, 'terminé')}>
                            Terminer
                          </Button>
                        )}
                        <Button variant="contained" color="error" onClick={() => handleStatusChange(rendezvous.id, 'annulé')}>
                          Annuler
                        </Button>
                        <Button variant="contained" onClick={() => handleStatusChange(rendezvous.id, 'reprogrammé')}>
                          Reprogrammer
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default AppointmentDashboard;
