import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import '../styles/rendezvous.css'; // Le fichier CSS externe

const AppointmentDashboard = ({ role }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const route = getAppointmentRoute(role);
      
      const res = await axios.get(`http://localhost:5000${route}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setAppointments(res.data);
    } catch (error) {
      console.error('Erreur chargement rendez-vous :', error);
    } finally {
      setLoading(false);
    }
  };

  const getAppointmentRoute = (role) => {
    switch(role) {
      case 'patient': return '/api/rendezvous/patient/me';
      case 'medecin': return '/api/rendezvous/medecin';
      default: return '/api/rendezvous';
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/rendezvous/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments();
    } catch (error) {
      console.error('Erreur mise à jour statut :', error);
    }
  };

  const handleRequestAppointment = () => {
    navigate('/patient/request-appointment');
  };

  if (loading) {
    return <p>Chargement des rendez-vous...</p>;
  }

  return (
    <div className="appointment-dashboard">
      <div className="dashboard-header">
        <h2>Mes Rendez-vous</h2>
        {role === 'patient' && (
          <button className="primary-button" onClick={handleRequestAppointment}>
            Demander un rendez-vous
          </button>
        )}
      </div>

      {appointments.length === 0 ? (
        <p>Aucun rendez-vous trouvé.</p>
      ) : (
        appointments.map((rendezvous) => (
          <div key={rendezvous.id} className="appointment-card">
            <p><strong>Date :</strong> {format(new Date(rendezvous.date), 'dd/MM/yyyy HH:mm')}</p>
            <p><strong>Motif :</strong> {rendezvous.motif}</p>
            <p><strong>Statut :</strong> {rendezvous.status}</p>
            <p><strong>Médecin :</strong> {rendezvous.medecin?.firstName} {rendezvous.medecin?.lastName}</p>
            <p><strong>Patient :</strong> {rendezvous.patient?.firstName} {rendezvous.patient?.lastName}</p>

            {role === 'medecin' && (
              <div className="button-group">
                {rendezvous.status === 'planifié' && (
                  <button
                    className="success-button"
                    onClick={() => handleStatusChange(rendezvous.id, 'terminé')}
                  >
                    Terminer
                  </button>
                )}
                <button
                  className="danger-button"
                  onClick={() => handleStatusChange(rendezvous.id, 'annulé')}
                >
                  Annuler
                </button>
                <button
                  className="neutral-button"
                  onClick={() => handleStatusChange(rendezvous.id, 'reprogrammé')}
                >
                  Reprogrammer
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AppointmentDashboard;
