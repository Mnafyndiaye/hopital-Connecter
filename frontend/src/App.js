import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddPatient from './pages/AddPatient';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import AssistantDashboard from './pages/AssistantDashboard';
import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/ajouter-patient" element={<AddPatient />} />
        <Route path="/admin" element={<AdminDashboard />} />
         <Route path="/assistant" element={<AssistantDashboard />} />
        {/*<Route path="/medecin" element={<MedecinDashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;