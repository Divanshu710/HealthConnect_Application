import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Headerdoctor from '../Pages/Headerdoctor';

function ViewAppointments() {
  const { doctor } = useParams();
  const [appointment, setAppointment] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const API = `https://codes-k5ka.onrender.com/api/v1/appointments/${doctor}/getappointmentsbydoctor`;


  useEffect(() => {
    const getAppointments = async () => {
      try {
        const res = await axios.get(API);
        setSuccess('Appointments fetched successfully');
        setAppointment(res.data.data.appointments);
        setError('');
      } catch (err) {
        console.log(err);
        setError('Failed to fetch appointments');
        setSuccess('');
      }
    };
    getAppointments();
  }, [API]);

  
  const getpatient_API=`https://codes-k5ka.onrender.com/api/v1/patient/${appointment.patientId}/getpatientname`
  // Filter future appointments (date >= today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const futureAppointments = appointment.filter(appt => {
    const apptDate = new Date(appt.date);
    apptDate.setHours(0, 0, 0, 0);
    return apptDate >= today;
  });

  return (
    <div>
      <Headerdoctor />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Upcoming Appointments
        </h2>

        {error && (
          <p className="text-center text-red-600 mb-6 font-semibold">{error}</p>
        )}
        {success && futureAppointments.length === 0 && (
          <p className="text-center text-gray-600 mb-6">No upcoming appointments found.</p>
        )}

        {futureAppointments.length > 0 && (
          <ul className="space-y-6">
            {futureAppointments.map((appt) => (
              <li
                key={appt._id}
                className="bg-white shadow-md rounded-lg p-5 border border-gray-200"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-700">Date:</span>
                  <span>{new Date(appt.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-700">Timeslot:</span>
                  <span>{appt.timeslot}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-700">Reason:</span>
                  <span>{appt.reason || 'N/A'}</span>
                </div>
                
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ViewAppointments;
