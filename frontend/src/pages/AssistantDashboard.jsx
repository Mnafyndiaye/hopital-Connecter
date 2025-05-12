import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Paper,
  Grid,
  Select,
  InputLabel,
  FormControl,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import AssistantSidebar from '../components/AssistantSidebar';

const AssistantDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    email: '',
    address: '',
    bloodType: '',
    password: '',
  });
  const [assignData, setAssignData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
    fetchMedecins();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/patients', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data);
    } catch (err) {
      console.error('Erreur lors du chargement des patients :', err);
    }
  };

  const fetchMedecins = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/medecins', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedecins(res.data);
    } catch (err) {
      console.error('Erreur chargement médecins :', err);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAssignChange = (patientId, medecinId) => {
    setAssignData((prev) => ({ ...prev, [patientId]: medecinId }));
  };

  const handleAssign = async (patientId) => {
    try {
      const medecinId = assignData[patientId];
      if (!medecinId) return;

      const token = localStorage.getItem('token');
      await axios.post(
        '/api/assistants/assign-medecin',
        { patientId, medecinId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Médecin assigné avec succès');
    } catch (err) {
      alert('Erreur assignation : ' + (err.response?.data?.error || 'Inconnue'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const assistantId = localStorage.getItem('assistantId');
      await axios.post('/api/patients', {
        ...formData,
        assistantId: parseInt(assistantId, 10),
      });
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        phoneNumber: '',
        email: '',
        address: '',
        bloodType: '',
        password: '',
      });
      fetchPatients();
    } catch (err) {
      alert('Erreur : ' + (err.response?.data?.error || 'Inconnue'));
    }
  };

  return (
    <Box display="flex">
      <AssistantSidebar />
      <Box p={4} flex={1}>
        <Typography variant="h4" gutterBottom>
          Tableau de bord de l'assistant
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6">Créer un patient</Typography>
          <Grid container spacing={2}>
            {[
              ['firstName', 'Prénom'],
              ['lastName', 'Nom'],
              ['phoneNumber', 'Téléphone'],
              ['email', 'Email'],
              ['address', 'Adresse'],
              ['bloodType', 'Groupe sanguin'],
              ['password', 'Mot de passe'],
            ].map(([field, label]) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField
                  label={label}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  fullWidth
                  type={field === 'password' ? 'password' : 'text'}
                />
              </Grid>
            ))}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date de naissance"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Genre</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <MenuItem value="homme">Homme</MenuItem>
                  <MenuItem value="femme">Femme</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" onClick={handleSubmit}>
                Ajouter
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Liste des patients
          </Typography>
          <List>
            {patients.map((patient) => (
              <React.Fragment key={patient.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={`${patient.firstName} ${patient.lastName}`}
                    secondary={
                      <>
                        <Typography variant="body2">{patient.email}</Typography>
                        <FormControl fullWidth sx={{ mt: 1 }}>
                          <InputLabel>Assigner un médecin</InputLabel>
                          <Select
                            value={assignData[patient.id] || ''}
                            onChange={(e) => handleAssignChange(patient.id, e.target.value)}
                          >
                            <MenuItem value="">Sélectionner</MenuItem>
                            {medecins.map((med) => (
                              <MenuItem key={med.id} value={med.User.id}>
                                {med.prenom} {med.nom}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <Button
                          variant="outlined"
                          sx={{ mt: 1 }}
                          onClick={() => handleAssign(patient.id)}
                        >
                          Assigner
                        </Button>
                      </>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default AssistantDashboard;
