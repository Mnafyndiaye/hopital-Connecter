import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, CircularProgress, List, ListItem, ListItemText, Divider } from '@mui/material';
import PatientSidebar from '../components/PatientSidebar';

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const patientRes = await axios.get('http://localhost:5000/api/patient/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatient(patientRes.data);

      const recordRes = await axios.get('http://localhost:5000/api/patient/medical-records', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setConsultations(recordRes.data.consultations || []);
      setMedicalRecords(recordRes.data.medicalRecords || []);
    } catch (err) {
      console.error('Erreur chargement patient :', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <PatientSidebar />
        <Box sx={{ flexGrow: 1, p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <PatientSidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>Bienvenue sur votre espace patient</Typography>

        {patient && (
          <Paper sx={{ p: 2, mb: 4 }}>
            <Typography variant="h6">Informations personnelles</Typography>
            <Typography>Nom : {patient.firstName} {patient.lastName}</Typography>
            <Typography>Email : {patient.email}</Typography>
            <Typography>Téléphone : {patient.phoneNumber}</Typography>
            <Typography>Adresse : {patient.address}</Typography>
            <Typography>Groupe sanguin : {patient.bloodType}</Typography>
            <Typography>Date de naissance : {patient.dateOfBirth}</Typography>
            <Typography>Genre : {patient.gender}</Typography>
          </Paper>
        )}

        <Paper sx={{ p: 2, mb: 4 }}>
          <Typography variant="h6">Consultations</Typography>
          {consultations.length > 0 ? (
            <List>
              {consultations.map((consultation) => (
                <React.Fragment key={consultation.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={`Date: ${consultation.date}`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">Notes : {consultation.notes}</Typography><br />
                          {consultation.signesVitaux && (
                            <Typography component="span" variant="body2">
                              Température : {consultation.signesVitaux.temperature}, Tension : {consultation.signesVitaux.tension},
                              Poids : {consultation.signesVitaux.poids}, Fréquence cardiaque : {consultation.signesVitaux.frequenceCardiaque}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography>Aucune consultation trouvée.</Typography>
          )}
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Autres Dossiers Médicaux</Typography>
          {medicalRecords.length > 0 ? (
            <List>
              {medicalRecords.map((record) => (
                <React.Fragment key={record.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={`Type: ${record.type}`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">Description : {record.description}</Typography><br />
                          <Typography component="span" variant="body2">Date : {record.date}</Typography><br />
                          <Typography component="span" variant="body2">Médecin : {record.doctorName || 'Non renseigné'}</Typography><br />
                          {record.attachmentUrl && (
                            <a href={record.attachmentUrl} target="_blank" rel="noopener noreferrer">Voir le fichier joint</a>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography>Aucun dossier médical trouvé.</Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default PatientDashboard;
