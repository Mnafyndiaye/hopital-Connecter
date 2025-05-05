import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import AssistantDashboard from './pages/AssistantDashboard';
import LoginPatient from './pages/LoginPatient';
import PatientDashboard from './pages/PatientDashboard';
import MedecinDashboard from './pages/MedecinDashboard';
import MedicalRecordDashboard from './pages/MedicalRecordDashboard';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AddConsultationPage from './pages/AddConsultationPage';
import MedicalImaging from './pages/MedicalImaging';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/loginPatient" element={<LoginPatient />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/assistant" element={<AssistantDashboard />} />
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/medecin" element={<MedecinDashboard />} /> 
        <Route path='/medecin/patient/:patientId' element={<MedicalRecordDashboard/>}/>
        <Route path='/medecin/patient/:patientId/ajouter-consultation' element={<AddConsultationPage/>}/>
        <Route path="/medecin/patient/:patientId/medical-imaging" element={<MedicalImaging />} />
      </Routes>
    </Router>
  );
}

export default App;