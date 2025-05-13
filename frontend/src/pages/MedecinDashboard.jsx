import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  Link,
  Divider
} from '@mui/material';
import MedecinSidebar from '../components/MedecinSidebar';

const MedecinDashboard = () => {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/medecins/patients', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data);
    } catch (error) {
      console.error("Erreur récupération patients :", error.response?.data || error.message);
    }
  };

  return (
    <MedecinSidebar>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Tableau de bord du Médecin
        </Typography>

        <Typography variant="h5" gutterBottom>
          Liste des patients
        </Typography>

        {patients.length === 0 ? (
          <Typography>Aucun patient disponible</Typography>
        ) : (
          <List>
            {patients.map((patient) => (
              <React.Fragment key={patient.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={`${patient.firstName} ${patient.lastName}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Téléphone : {patient.phoneNumber}
                        </Typography>
                        <br />
                        <Link href={`/medecin/patient/${patient.id}`} underline="hover">
                          Voir dossier médical
                        </Link>
                      </>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </MedecinSidebar>
  );
};

export default MedecinDashboard;
