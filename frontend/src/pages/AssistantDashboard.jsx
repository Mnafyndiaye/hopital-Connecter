import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssistantDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    email: '',
    address: '',
    bloodType: '',
    password: '',
  });

  const [assignData, setAssignData] = useState({}); // { patientId: medecinId }

  useEffect(() => {
    fetchPatients();
    fetchMedecins();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/patients', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data);
    } catch (err) {
      console.error('Erreur lors du chargement des patients :', err);
    }
  };
  

  const fetchMedecins = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/medecins', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedecins(res.data);
      console.log('Médecins chargés :', res.data);
    } catch (err) {
      console.error('Erreur chargement médecins :', err);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAssignChange = (patientId, medecinId) => {
    setAssignData(prev => ({
      ...prev,
      [patientId]: medecinId
    }));
  };

  const handleAssign = async (patientId) => {
    try {
      const medecinId = assignData[patientId];
      if (!medecinId) return;
  
      const token = localStorage.getItem('token');
  
      await axios.post(`/api/assistants/assign-medecin`, {
        patientId,
        medecinId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      alert('Médecin assigné avec succès');
    } catch (err) {
      alert('Erreur assignation : ' + (err.response?.data?.error || 'Inconnue'));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const assistantId = localStorage.getItem('assistantId');

      await axios.post('/api/patients', {
        ...formData,
        assistantId: parseInt(assistantId, 10)
      });

      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        phoneNumber: '',
        email: '',
        address: '',
        bloodType: '',
        password: '',
      });

      fetchPatients();
    } catch (err) {
      alert('Erreur : ' + err.response?.data?.error || 'Inconnue');
    }
  };

  return (
    <div>
      <h2>Créer un patient</h2>
      <form onSubmit={handleSubmit}>
        <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Prénom" required />
        <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Nom" required />
        <input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required />
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Sélectionner le genre</option>
          <option value="homme">Homme</option>
          <option value="femme">Femme</option>
        </select>
        <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Téléphone" required />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        <input name="address" value={formData.address} onChange={handleChange} placeholder="Adresse" />
        <input name="bloodType" value={formData.bloodType} onChange={handleChange} placeholder="Groupe sanguin" />
        <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Mot de passe" required />
        <button type="submit">Ajouter</button>
      </form>

      <h2>Liste des patients</h2>
      <ul>
        {patients.map((patient) => (
          <li key={patient.id}>
            {patient.firstName} {patient.lastName} - {patient.email}
            <br />
            <label>Assigner un médecin :</label>
            <select
              value={assignData[patient.id] || ''}
              onChange={(e) => handleAssignChange(patient.id, e.target.value)}
            >
              <option value="">Sélectionner</option>
              {medecins.map((med) => (
                <option key={med.id} value={med.User.id}>
                  {med.prenom} {med.nom}
                </option>
              ))}
            </select>
            <button onClick={() => handleAssign(patient.id)}>Assigner</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssistantDashboard;
