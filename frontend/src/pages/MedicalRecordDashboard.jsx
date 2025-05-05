import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';


const MedicalRecordDashboard = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patientInfo, setPatientInfo] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);

  const [formData, setFormData] = useState({
    date: '',
    notes: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMedicalData();
  }, []);

  const fetchMedicalData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/medical/patient/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatientInfo(res.data.patient);
      setConsultations(res.data.consultations || []);
      setMedicalRecords(res.data.medicalRecords || []);
    } catch (error) {
      console.error("Erreur lors du chargement du dossier médical :", error.response?.data || error.message);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/medical/consultations/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`http://localhost:5000/api/medical/consultations`, {
          ...formData,
          patientId
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setFormData({ date: '', notes: '' });
      setEditingId(null);
      fetchMedicalData();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err.response?.data || err.message);
    }
  };

  const handleEdit = (consultation) => {
    setFormData({ date: consultation.date, notes: consultation.notes });
    setEditingId(consultation.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cette consultation ?')) {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/medical/consultations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMedicalData();
    }
  };

  return (
    <div  style={{ height: '100vh', overflowY: 'auto', padding: '20px' }}>
      <h2>Dossier Médical du Patient</h2>

      {patientInfo && (
        <div style={{ marginBottom: '30px', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
          <h3>Informations Personnelles</h3>
          <p><strong>Nom :</strong> {patientInfo.lastName}</p>
          <p><strong>Prénom :</strong> {patientInfo.firstName}</p>
          <p><strong>Sexe :</strong> {patientInfo.gender}</p>
          <p><strong>Date de naissance :</strong> {patientInfo.dateOfBirth}</p>
          <p><strong>Groupe sanguin :</strong> {patientInfo.bloodType}</p>
        </div>
      )}

      <h3>Consultations</h3>

      <button onClick={() => navigate(`/medecin/patient/${patientId}/ajouter-consultation`)} style={{
        marginBottom: '20px',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
        }}> Faire une consultation
        </button>

      {consultations.length === 0 ? (
        <p>Aucune consultation enregistrée.</p>
      ) : (
        <ul>
          {consultations.map((c) => (
            <li key={c.id} style={{ marginBottom: '15px' }}>
              <strong>Date :</strong> {c.date} <br />
              <strong>Notes :</strong> {c.notes}
              <ul>
                <li>
                  <strong>Prescriptions :</strong>
                  <ul>
                    {c.Prescriptions?.map((p) => (
                      <li key={p.id}>
                        {p.medication} - {p.dosage} - {p.frequency} - {p.duration}
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <strong>Signes Vitaux :</strong>
                  <ul>
                    <li>Température : {c.SignesVitaux?.temperature}</li>
                    <li>Tension : {c.SignesVitaux?.bloodPressure}</li>
                    <li>Fréquence cardiaque : {c.SignesVitaux?.heartRate}</li>
                    <li>Respiration : {c.SignesVitaux?.respiratoryRate}</li>
                  </ul>
                </li>
              </ul>
              <button onClick={() => handleEdit(c)} style={{ marginRight: '10px' }}>Modifier</button>
              <button onClick={() => handleDelete(c.id)} style={{ color: 'red' }}>Supprimer</button>
            </li>
          ))}
        </ul>
      )}

      <h3>Documents Médicaux</h3>
      <button onClick={() => navigate(`/medecin/patient/${patientId}/medical-imaging`)} className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
        Voir les Images DICOM
      </button>
      {medicalRecords.length === 0 ? (
        <p>Aucun document médical.</p>
      ) : (
        <ul>
          {medicalRecords.map((m) => (
            <li key={m.id} style={{ marginBottom: '10px' }}>
                
              <strong>Type :</strong> {m.type} | <strong>Date :</strong> {m.date} <br />
              <strong>Description :</strong> {m.description} <br />
              <strong>Ajouté par :</strong> {m.doctorName} <br />
              {m.attachmentUrl && (
                <a href={m.attachmentUrl} target="_blank" rel="noopener noreferrer">
                  Voir le document
                </a>
              )}
            </li>
            
          ))}
        </ul>
      )}
      
    </div>
  );
};

export default MedicalRecordDashboard;
