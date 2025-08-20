import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Headerpatient from '../Pages/Headerpatient';
import { Calendar, Clock, User, Clipboard } from "lucide-react";

function UpcomingBookings() {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [appointment, setAppointment] = useState([]);
  const [doctorNamesMap, setDoctorNamesMap] = useState({});
  const { patient } = useParams();
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

  useEffect(() => {
    const fetchDoctorNames = async () => {
      const uniqueDoctorIds = [...new Set(appointment.map((appt) => appt.doctorId))];
      const nameMap = {};
      await Promise.all(
        uniqueDoctorIds.map(async (doctorId) => {
          try {
            const res = await axios.get(`https://codes-k5ka.onrender.com/api/v1/doctor/${doctorId}/getdoctorname`);
            nameMap[doctorId] = res.data.data || res.data;
          } catch (error) {
            nameMap[doctorId] = 'Unknown Doctor';
          }
        })
      );
      setDoctorNamesMap(nameMap);
    };
    if (appointment.length > 0) {
      fetchDoctorNames();
    }
  }, [appointment]);

  const today = new Date();
  const upcomingAppointments = appointment.filter((appt) => {
    const apptDate = new Date(appt.date);
    apptDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return apptDate >= today;
  });

  return (
    <div>
      <Headerpatient />
      <div className="min-h-screen bg-white px-6 py-12 flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-10 text-center">
          Upcoming Bookings
        </h2>

        {error && (
          <p className="text-center text-red-600 mb-4 font-semibold">{error}</p>
        )}
        {success && upcomingAppointments.length === 0 && (
          <p className="text-center text-gray-600 mb-4">No upcoming appointments</p>
        )}

        {upcomingAppointments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
            {upcomingAppointments.map((appt) => (
              <div
                key={appt._id}
                className="bg-gradient-to-br from-emerald-500 to-green-400 rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition duration-300 p-6 text-white"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Calendar className="w-5 h-5" />
                  <span className="text-lg font-semibold">
                    {new Date(appt.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="w-5 h-5" />
                  <span>{appt.timeslot}</span>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <User className="w-5 h-5" />
                  <span>{doctorNamesMap[appt.doctorId] || 'Loading...'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clipboard className="w-5 h-5" />
                  <span>{appt.reason || 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UpcomingBookings;
