import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PatientMedicalRecord = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      const token = localStorage.getItem('token'); // supposons que le token JWT est stocké ici
      const response = await axios.get('/api/patient/medical-records', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMedicalRecords(response.data);
    } catch (error) {
      console.error('Erreur chargement du dossier médical :', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Mon dossier médical</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : medicalRecords.length === 0 ? (
        <p>Aucun enregistrement trouvé.</p>
      ) : (
        <ul className="space-y-4">
          {medicalRecords.map(record => (
            <li key={record.id} className="border p-4 rounded shadow-sm">
              <p><strong>Type :</strong> {record.type}</p>
              <p><strong>Description :</strong> {record.description}</p>
              <p><strong>Date :</strong> {record.date}</p>
              {record.doctorName && <p><strong>Médecin :</strong> {record.doctorName}</p>}
              {record.attachmentUrl && (
                <p><a href={record.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600">Voir le fichier joint</a></p>
              )}
              {record.orthancId && (
                <p><a href={`http://localhost:8042/web-viewer.html?study=${record.orthancId}`} target="_blank" rel="noopener noreferrer" className="text-green-600">Voir l’imagerie (DICOM)</a></p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientMedicalRecord;
