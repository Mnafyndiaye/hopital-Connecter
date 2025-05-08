import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MedecinDashboard = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/medecins/patients', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPatients(res.data);
    } catch (error) {
      console.error("Erreur récupération patients :", error.response?.data || error.message);
    }
  };
  const navigate = useNavigate();
  return (
    <div>
      <h2>Tableau de bord du Médecin</h2>
      <button onClick={() => navigate('/medecin/appointments')} style={{
          marginTop: '10px',
          padding: '10px 20px',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
      }}> Voir mes rendez-vous </button>
      <h3>Liste des patients</h3>
      {patients.length === 0 ? (
        <p>Aucun patient disponible</p>
      ) : (
        <ul>
          {patients.map((patient) => (
            <li key={patient.id}>
              {patient.firstName} {patient.lastName} — {patient.phoneNumber}
              <a href={`/medecin/patient/${patient.id}`}>Voir dossier médical</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MedecinDashboard;
