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
import AppointmentDashboard from './pages/AppointmentDashboard';
import PatientRequestAppointment from './pages/PatientRequestAppointment';
import AssistantAppointmentDashboard from './pages/AssistantAppointmentDashboard';

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
        <Route path="/medecin/appointments" element={<AppointmentDashboard role="medecin" />} />
        <Route path="/patient/appointments" element={<AppointmentDashboard role="patient" />} />
        <Route path="/patient/request-appointment" element={<PatientRequestAppointment />} />
        <Route path="/assistant/appointments" element={<AssistantAppointmentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;