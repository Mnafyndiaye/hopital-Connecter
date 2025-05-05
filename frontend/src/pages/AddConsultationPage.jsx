import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const AddConsultationPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [consultationData, setConsultationData] = useState({
    date: '',
    notes: ''
  });

  const [prescriptions, setPrescriptions] = useState([
    { medication: '', dosage: '', instructions: '' }
  ]);

  const [signesVitauxData, setSignesVitauxData] = useState({
    temperature: '',
    tension: '',
    frequenceCardiaque: '',
    poids: ''
  });

  const handleChange = (e, setter) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value }));
  };

  const handlePrescriptionChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...prescriptions];
    updated[index][name] = value;
    setPrescriptions(updated);
  };

  const addPrescription = () => {
    setPrescriptions([...prescriptions, { medication: '', dosage: '', instructions: '' }]);
  };

  const removePrescription = (index) => {
    const updated = prescriptions.filter((_, i) => i !== index);
    setPrescriptions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post('http://localhost:5000/api/medical/consultation', {
        patientId,
        ...consultationData,
        prescriptions,
        signesVitaux: signesVitauxData
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate(`/medical-record/${patientId}`);
    } catch (err) {
      console.error("Erreur lors de l'ajout de la consultation :", err.response?.data || err.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Nouvelle Consultation</h2>
      <form onSubmit={handleSubmit}>
        <h4>Consultation</h4>
        <input type="date" name="date" value={consultationData.date} onChange={(e) => handleChange(e, setConsultationData)} required />
        <textarea name="notes" placeholder="Notes" value={consultationData.notes} onChange={(e) => handleChange(e, setConsultationData)} />

        <h4>Prescriptions</h4>
        {prescriptions.map((prescription, index) => (
          <div key={index} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
            <input name="medication" placeholder="Médicament" value={prescription.medication} onChange={(e) => handlePrescriptionChange(index, e)} />
            <input name="dosage" placeholder="Dosage" value={prescription.dosage} onChange={(e) => handlePrescriptionChange(index, e)} />
            <input name="instructions" placeholder="Instructions" value={prescription.instructions} onChange={(e) => handlePrescriptionChange(index, e)} />
            {prescriptions.length > 1 && (
              <button type="button" onClick={() => removePrescription(index)} style={{ color: 'red' }}>
                Supprimer
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addPrescription} style={{ marginBottom: '20px' }}>
          + Ajouter une prescription
        </button>

        <h4>Signes Vitaux</h4>
        <input name="temperature" placeholder="Température" value={signesVitauxData.temperature} onChange={(e) => handleChange(e, setSignesVitauxData)} />
        <input name="tension" placeholder="Tension artérielle" value={signesVitauxData.tension} onChange={(e) => handleChange(e, setSignesVitauxData)} />
        <input name="frequenceCardiaque" placeholder="Fréquence cardiaque" value={signesVitauxData.frequenceCardiaque} onChange={(e) => handleChange(e, setSignesVitauxData)} />
        <input name="poids" placeholder="Poids (kg)" value={signesVitauxData.poids} onChange={(e) => handleChange(e, setSignesVitauxData)} />

        <button type="submit">Enregistrer la consultation</button>
      </form>
    </div>
  );
};

export default AddConsultationPage;
