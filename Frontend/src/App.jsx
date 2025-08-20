import { useState,useContext } from 'react'
import Patientregistration from './Registration/Patientregistration'
import LandingPage from './Pages/LandingPage'
import Patientlogin from './Login/Patientlogin'
import PatientDashboard from './Dashboard/PatientDashboard'
import Doctorlogin from './Login/Doctorlogin'
import DoctorDashboard from './Dashboard/DoctorDashboard'
import Booking from './Dashboard/Booking'
import './App.css'
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import { AuthContextPatient } from './ContextAPI/AuthContextPatient'
import { AuthContextDoctor } from './ContextAPI/AuthContextDoctor'
import Bookappointments from './Dashboard/Bookappointments'
import UpcomingBookings from './Dashboard/UpcomingBookings'
import Appointmenthistory from './Dashboard/Appointmenthistory'
import ViewAppointments from './Dashboard/ViewAppointments'
import Historyappointments from './Dashboard/Historyappointments'

function App() {
  const {patient}=useContext(AuthContextPatient)
  const {doctor}=useContext(AuthContextDoctor)
  return (
   <Router>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/patient-register" element={<Patientregistration />} />
          <Route path="/patient-login" element={<Patientlogin/>}/>
          {patient && <Route path={`/patient/:patient/patient-dashboard`} element={<PatientDashboard/>}/>}
          {patient && <Route path={`/patient/:patient/book-appointment`} element={<Bookappointments/>}/>}
          {patient && <Route path={`/patient/:patient/upcoming-appointments`} element={<UpcomingBookings/>}/>}
           {patient && <Route path={`/patient/:patient/history`} element={<Appointmenthistory/>}/>}
          <Route path="/patient/:patient/:doctorName/book-appointment" element={<Booking />} />

          <Route path="/doctor-login" element={<Doctorlogin/>}/>
          {doctor && <Route path={`doctor/:doctor/doctor-dashboard`} element={<DoctorDashboard/>}/>}
          {doctor && <Route path={`doctor/:doctor/appointments`} element={<ViewAppointments/>}/>}
          {doctor && <Route path={`doctor/:doctor/history-appointments`} element={<Historyappointments/>}/>}
        </Routes>
      </div>
    </Router>
  )
}

export default App
