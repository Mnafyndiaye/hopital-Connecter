import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    fetchPatientInfo();
  }, []);

  const fetchPatientInfo = async () => {
    try {
      const token = localStorage.getItem('token'); // Assure-toi que le token est bien stocké ici après login
      if (!token) {
        console.error('Aucun token trouvé');
        return;
      }

      const res = await axios.get('http://localhost:5000/api/patient/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPatient(res.data);
    } catch (err) {
      console.error('Erreur chargement patient :', err.response?.data || err.message);
    }
  };

  return (
    <div>
      <h2>Bienvenue sur votre espace patient</h2>
      {patient ? (
        <div>
          <p><strong>Nom :</strong> {patient.firstName} {patient.lastName}</p>
          <p><strong>Email :</strong> {patient.email}</p>
          <p><strong>Téléphone :</strong> {patient.phoneNumber}</p>
          <p><strong>Adresse :</strong> {patient.address}</p>
          <p><strong>Groupe sanguin :</strong> {patient.bloodType}</p>
          <p><strong>Date de naissance :</strong> {patient.dateOfBirth}</p>
          <p><strong>Genre :</strong> {patient.gender}</p>
        </div>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
};

export default PatientDashboard;
