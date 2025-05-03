import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import AssistantDashboard from './pages/AssistantDashboard';
import LoginPatient from './pages/LoginPatient';
import PatientDashboard from './pages/PatientDashboard';
import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/loginPatient" element={<LoginPatient />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/assistant" element={<AssistantDashboard />} />
        <Route path="/patient" element={<PatientDashboard />} />
        {/*<Route path="/medecin" element={<MedecinDashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;