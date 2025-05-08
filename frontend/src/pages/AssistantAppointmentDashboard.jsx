import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AssistantAppointmentDashboard.css'; // Assurez-vous d'avoir ce fichier CSS pour le style

const AssistantAppointmentDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [selectedMedecinId, setSelectedMedecinId] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAppointments();
    fetchMedecins();
  }, []);

  // Récupérer les rendez-vous en attente
  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/rendezvous/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (error) {
      console.error('Erreur chargement des rendez-vous :', error);
    }
  };

  // Récupérer les médecins disponibles
  const fetchMedecins = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/medecins', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedecins(res.data);
    } catch (error) {
      console.error('Erreur chargement des médecins :', error);
    }
  };

  // Programmes un rendez-vous en envoyant la nouvelle date et l'heure
  const handleAssign = async () => {
    if (!selectedAppointment || !newDate || !newTime || !selectedMedecinId) return;

    try {
      const scheduledDate = `${newDate}T${newTime}`;

      await axios.put(
        `http://localhost:5000/api/rendezvous/${selectedAppointment.id}/schedule`,
        {
          date: scheduledDate,
          medecinId: selectedMedecinId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSelectedAppointment(null);
      setNewDate('');
      setNewTime('');
      setSelectedMedecinId('');
      fetchAppointments(); // Recharge les rendez-vous
    } catch (error) {
      console.error('Erreur programmation rendez-vous:', error);
    }
  };

  return (
    <div className="appointment-container" style={{ height: '100vh', overflowY: 'auto', padding: '20px' }}>
      <h2 className="section-title">Rendez-vous à programmer</h2>

      {appointments.length === 0 ? (
        <p>Aucun rendez-vous en attente.</p>
      ) : (
        <ul>
          {appointments.map((rdv) => (
            <li key={rdv.id} className="appointment-card">
              <p><strong>Patient :</strong> {rdv.patient?.firstName} {rdv.patient?.lastName}</p>
              <p><strong>Medecin :</strong>{rdv.medecin?.prenom} {rdv.medecin?.nom}</p>
              <p><strong>Motif :</strong> {rdv.motif}</p>
              <p><strong>Date actuelle :</strong> {new Date(rdv.date).toLocaleString()}</p>
              <button
                className="program-button"
                onClick={() => setSelectedAppointment(rdv)}
              >
                Programmer
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedAppointment && (
        <div className="form-container">
          <h3 className="section-title">Programmer le rendez-vous</h3>

          <div className="form-group">
            <label>Date :</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Heure :</label>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Médecin :</label>
            <select
              value={selectedMedecinId}
              onChange={(e) => setSelectedMedecinId(e.target.value)}
            >
              <option value="">Sélectionner un médecin</option>
              {medecins.map((m) => (
                <option key={m.id} value={m.id}>
                  Dr {m.prenom} {m.nom}
                </option>
              ))}
            </select>
          </div>

          <button className="submit-button" onClick={handleAssign}>
            Confirmer
          </button>
        </div>
      )}
    </div>
  );
};

export default AssistantAppointmentDashboard;
