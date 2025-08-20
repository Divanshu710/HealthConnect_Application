import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Headerpatient from '../Pages/Headerpatient';

function Appointmenthistory() {


    const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [appointment, setAppointment] = useState([]);
  const { patient } = useParams();
  //const API = `http://localhost:5000/api/v1/appointments/${patient}/getappointments`;
  const API = `https://codes-k5ka.onrender.com/api/v1/appointments/${patient}/getappointments`;

  useEffect(() => {
    const getAllAppointments = async () => {
      try {
        const res = await axios.get(API);
        setSuccess('Appointments fetched successfully');
        setAppointment(res.data.data.appointments);
      } catch (error) {
        console.log(error);
        setError(error.message || 'Unable to fetch appointments');
      }
    };
    getAllAppointments();
  }, [API]);

  const today = new Date();
  const historyAppointments = appointment.filter(appt => {
    const apptDate = new Date(appt.date);
    apptDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    return apptDate < today;
  });

  return (
    <div>
      <Headerpatient />
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
           Booking history
        </h2>

        {error && (
          <p className="text-center text-red-600 mb-4 font-semibold">{error}</p>
        )}
        {success && historyAppointments.length === 0 && (
          <p className="text-center text-gray-600 mb-4">No appointments in history</p>
        )}

        {historyAppointments.length > 0 && (
          <ul className="space-y-6">
            {historyAppointments.map((appt) => (
              <li
                key={appt._id}
                className="bg-white shadow-md rounded-lg p-5 border border-gray-200"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-700">
                    Date:
                  </span>
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
  )
}

export default Appointmenthistory