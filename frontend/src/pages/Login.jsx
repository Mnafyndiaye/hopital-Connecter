import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // Le fichier CSS externe

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '', role: '' });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur inconnue');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // ✅ Stocker l'assistantId si assistant
      if (data.user.role === 'assistant' && data.user.assistantId) {
        localStorage.setItem('assistantId', data.user.assistantId);
      }

      // Rediriger selon le rôle
      if (data.user.role === 'admin') navigate('/admin');
      else if (data.user.role === 'assistant') navigate('/assistant');
      else if (data.user.role === 'medecin') navigate('/medecin');
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
            <i className="fas fa-user"></i>
            <input
              name="username"
              placeholder="UserName"
              value={formData.username}
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
          <div className="input-group">
            <i className="fas fa-user-tag"></i>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Rôle</option>
              <option value="admin">Administrateur</option>
              <option value="assistant">Assistant</option>
              <option value="medecin">Médecin</option>
            </select>
          </div>
          <button type="submit" className="login-button">
            Se Connecter
          </button>
          
        </form>
        <div className="login-illustration">
          <img src="/images/illustration-medecin.svg" alt="Illustration médicale" />
        </div>
      </div>
    </div>
  );
}

export default Login;
