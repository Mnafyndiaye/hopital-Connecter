import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

      const patientRes = await axios.get('http://localhost:5000/api/patient/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatient(patientRes.data);

      const recordRes = await axios.get('http://localhost:5000/api/patient/medical-records', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setConsultations(recordRes.data.consultations || []);
      setMedicalRecords(recordRes.data.medicalRecords || []);

      setLoading(false);
    } catch (err) {
      console.error('Erreur chargement patient :', err.response?.data || err.message);
      setLoading(false);
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div style={{ height: '100vh', overflowY: 'auto', padding: '20px' }}>
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
      <button onClick={() => navigate('/patient/appointments')} style={{
          marginTop: '10px',
          padding: '10px 20px',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
      }}> Voir mes rendez-vous </button>
      {/* Consultations */}
      <h3>Consultations</h3>
      {consultations.length > 0 ? (
        <ul>
          {consultations.map(consultation => (
            <li key={consultation.id} style={{ border: '1px solid #ccc', marginBottom: '20px', padding: '10px' }}>
              <p><strong>Date :</strong> {consultation.date}</p>
              <p><strong>Notes :</strong> {consultation.notes}</p>

              {consultation.signesVitaux && (
                <div>
                  <h5>Signes Vitaux</h5>
                  <ul>
                    <li><strong>Température :</strong> {consultation.signesVitaux.temperature}</li>
                    <li><strong>Tension :</strong> {consultation.signesVitaux.tension}</li>
                    <li><strong>Poids :</strong> {consultation.signesVitaux.poids}</li>
                    <li><strong>Fréquence cardiaque :</strong> {consultation.signesVitaux.frequenceCardiaque}</li>
                  </ul>
                </div>
              )}

              {consultation.prescriptions?.length > 0 && (
                <div>
                  <h5>Prescriptions</h5>
                  <ul>
                    {consultation.prescriptions.map(p => (
                      <li key={p.id}>
                        {p.medication} - {p.dosage} - {p.instructions}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune consultation trouvée.</p>
      )}

      {/* Autres dossiers médicaux */}
      <h3>Autres Dossiers Médicaux</h3>
      {medicalRecords.length > 0 ? (
        <ul>
          {medicalRecords.map(record => (
            <li key={record.id} style={{ marginBottom: '20px' }}>
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
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun autre dossier médical trouvé.</p>
      )}
    </div>
  );
};

export default PatientDashboard;
