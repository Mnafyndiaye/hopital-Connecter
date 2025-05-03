import { useState } from 'react';

function AddPatient() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'homme',
    phoneNumber: '',
    email: '',
    address: '',
    bloodType: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Erreur lors de la création du patient');
      alert('Patient ajouté avec succès');
      setFormData({ firstName: '', lastName: '', dateOfBirth: '', gender: 'homme', phoneNumber: '', email: '', address: '', bloodType: '', password: '' });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Créer un nouveau patient</h2>
      <form onSubmit={handleSubmit}>
        <input name="firstName" placeholder="Prénom" onChange={handleChange} value={formData.firstName} required />
        <input name="lastName" placeholder="Nom" onChange={handleChange} value={formData.lastName} required />
        <input type="date" name="dateOfBirth" onChange={handleChange} value={formData.dateOfBirth} required />
        <select name="gender" onChange={handleChange} value={formData.gender}>
          <option value="homme">Homme</option>
          <option value="femme">Femme</option>
        </select>
        <input name="phoneNumber" placeholder="Téléphone" onChange={handleChange} value={formData.phoneNumber} required />
        <input name="email" placeholder="Email (facultatif)" onChange={handleChange} value={formData.email} />
        <input name="address" placeholder="Adresse" onChange={handleChange} value={formData.address} />
        <input name="bloodType" placeholder="Groupe sanguin" onChange={handleChange} value={formData.bloodType} />
        <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} value={formData.password} required />
        <button type="submit">Créer le patient</button>
      </form>
    </div>
  );
}

export default AddPatient;
