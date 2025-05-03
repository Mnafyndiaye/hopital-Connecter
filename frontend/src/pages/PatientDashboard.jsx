import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Aucun token trouvé');
        return;
      }

      // Récupérer les informations personnelles
      const patientRes = await axios.get('http://localhost:5000/api/patient/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatient(patientRes.data);

      // Récupérer le dossier médical
      const recordRes = await axios.get('http://localhost:5000/api/patient/medical-records', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedicalRecords(recordRes.data);

      setLoading(false);
    } catch (err) {
      console.error('Erreur chargement patient :', err.response?.data || err.message);
      setLoading(false);
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Bienvenue sur votre espace patient</h2>

      {/* Infos personnelles */}
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
        <p>Impossible de charger vos informations.</p>
      )}

      {/* Dossier médical */}
      <h3>Dossier médical</h3>
      {medicalRecords.length > 0 ? (
        <ul>
          {medicalRecords.map(record => (
            <li key={record.id} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
              <p><strong>Date :</strong> {record.date}</p>
              <p><strong>Type :</strong> {record.type}</p>
              <p><strong>Description :</strong> {record.description}</p>
              <p><strong>Médecin :</strong> {record.doctorName || 'Non renseigné'}</p>

              {record.attachmentUrl && (
                <p>
                  <a href={record.attachmentUrl} target="_blank" rel="noopener noreferrer">
                    Voir le fichier joint
                  </a>
                </p>
              )}

              {record.orthancId && (
                <p>
                  <a
                    href={`http://localhost:8042/web-viewer.html?study=${record.orthancId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Voir l'imagerie DICOM
                  </a>
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun enregistrement médical trouvé.</p>
      )}
    </div>
  );
};

export default PatientDashboard;
