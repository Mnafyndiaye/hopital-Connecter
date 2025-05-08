import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/PatientRequestAppointment.css';

const PatientRequestAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [patientId, setPatientId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const resDoctors = await axios.get('http://localhost:5000/api/medecins', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctors(resDoctors.data);

        const resPatient = await axios.get('http://localhost:5000/api/patient/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatientId(resPatient.data.id);
      } catch (err) {
        console.error('Erreur lors du chargement des données :', err.response?.data || err.message);
        setMessage("Erreur lors du chargement des données.");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');

    if (!selectedDoctorId || !date || !time || !reason || !patientId) {
      setMessage("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/rendezvous',
        {
          patientId,
          medecinId: selectedDoctorId,
          date: `${date}T${time}`,
          motif: reason,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Réponse backend :', response.data);
      setMessage('✅ Demande de rendez-vous envoyée avec succès.');
      setSelectedDoctorId('');
      setDate('');
      setTime('');
      setReason('');
    } catch (err) {
      console.error("❌ Erreur lors de l'envoi :", err.response?.data || err.message);
      setMessage("❌ Une erreur est survenue lors de l'envoi.");
    }
  };

  return (
    <div className="appointment-request-container">
      <h2>Demande de rendez-vous</h2>

      <div className="form-group">
        <label>Médecin</label>
        <select value={selectedDoctorId} onChange={(e) => setSelectedDoctorId(e.target.value)}>
          <option value="">-- Choisir un médecin --</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              Dr {doc.prenom} {doc.nom}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Heure</label>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Motif</label>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} />
      </div>

      <button className="primary-button" onClick={handleSubmit}>
        Envoyer la demande
      </button>

      {message && (
        <div
          className="message"
          style={{ marginTop: '10px', color: message.startsWith('✅') ? 'green' : 'red' }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default PatientRequestAppointment;
