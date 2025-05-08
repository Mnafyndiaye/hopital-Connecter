import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // Le fichier CSS externe

function LoginPatient() {
  const [formData, setFormData] = useState({ phoneNumber: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/auth/login-patient/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur inconnue');

      localStorage.setItem('token', data.token);
      localStorage.setItem('patient', JSON.stringify(data.patient));

      navigate('/patient/'); // Redirection vers la page patient
    } catch (err) {
      alert('Erreur de connexion : ' + err.message);
    }
  };

  return (
    <div className="login-page">
      <h1 className="logo-title">MEDICONNECT</h1>
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <i className="fas fa-phone"></i>
            <input
              name="phoneNumber"
              placeholder="Numéro de téléphone"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <i className="fas fa-lock"></i>
            <input
              name="password"
              type="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Se Connecter
          </button>
        </form>
        <div className="login-illustration">
          <img src="/images/Hospital-patient.svg" alt="Illustration médicale" />
        </div>
      </div>
    </div>
  );
}

export default LoginPatient;
