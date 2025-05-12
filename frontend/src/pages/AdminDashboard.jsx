import { useState, useEffect } from 'react';
import '../styles/AdminDashboard.css'; // Assurez-vous d'avoir ce fichier CSS pour le style

function AdminDashboard() {
  const [formType, setFormType] = useState('medecin');
  const [formData, setFormData] = useState({});
  const [assistants, setAssistants] = useState([]);
  const [medecins, setMedecins] = useState([]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = formType === 'medecin' ? '/api/medecins' : '/api/assistants';

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert(`${formType === 'medecin' ? 'Médecin' : 'Assistant'} ajouté avec succès`);
      setFormData({});
      fetchUsers();
    } catch (err) {
      alert('Erreur : ' + err.message);
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [resA, resM] = await Promise.all([
        fetch('/api/assistants', { headers }),
        fetch('/api/medecins', { headers }),
      ]);

      setAssistants(await resA.json());
      setMedecins(await resM.json());
    } catch (err) {
      alert('Erreur de chargement : ' + err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-container">
      <h2>Ajouter un {formType === 'medecin' ? 'médecin' : 'assistant médical'}</h2>

      <div className="toggle-buttons">
        <button
          className={formType === 'medecin' ? 'active' : ''}
          onClick={() => setFormType('medecin')}
        >
          Ajouter Médecin
        </button>
        <button
          className={formType === 'assistant' ? 'active' : ''}
          onClick={() => setFormType('assistant')}
        >
          Ajouter Assistant
        </button>
      </div>

      <form className="user-form" onSubmit={handleSubmit}>
        <input name="username" placeholder="Nom d'utilisateur" required onChange={handleChange} />
        <input type="password" name="password" placeholder="Mot de passe" required onChange={handleChange} />
        <input name="nom" placeholder="Nom" required onChange={handleChange} />
        <input name="prenom" placeholder="Prénom" required onChange={handleChange} />
        <input name="telephone" placeholder="Téléphone" required onChange={handleChange} />
        <input name="email" placeholder="Email (facultatif)" onChange={handleChange} />
        <input name="adresse" placeholder="Adresse" onChange={handleChange} />

        {formType === 'medecin' && (
          <>
            <input name="specialite" placeholder="Spécialité" required onChange={handleChange} />
            <input name="numeroSS" placeholder="Numéro de sécurité sociale" required onChange={handleChange} />
          </>
        )}

        <button type="submit" className="submit-button">Enregistrer</button>
      </form>

      <div className="list-section">
        <h3>Médecins enregistrés</h3>
        <ul>
          {medecins.map((m) => (
            <li key={m.id}>{m.nom} {m.prenom} – {m.specialite}</li>
          ))}
        </ul>
      </div>

      <div className="list-section">
        <h3>Assistants médicaux</h3>
        <ul>
          {assistants.map((a) => (
            <li key={a.id}>{a.nom} {a.prenom} – {a.telephone}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;
