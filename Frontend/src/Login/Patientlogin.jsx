import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContextPatient } from '../ContextAPI/AuthContextPatient';
import { motion } from "framer-motion";

// const API = 'http://localhost:5000/api/v1/patient/login';
const API = 'https://codes-k5ka.onrender.com/api/v1/patient/login';




function Patientlogin() {
  const navigate = useNavigate();
  const { setPatient } = useContext(AuthContextPatient);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (success === 'Login Successful') {
      navigate(`/patient/${username}/patient-dashboard`);
    }
  }, [success, navigate, username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API, { username, password });
      setSuccess('Login Successful');
      setPatient(username);
      setError('');
      console.log(res);
    } catch (error) {
      console.log(error.response);
      if (error.response?.status === 404) {
        setError('Patient not found');
      } else if (error.response?.status === 400) {
        setError('Invalid Credentials');
      } else {
        setError(error.message || 'Something went wrong');
        setSuccess('');
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white to-emerald-50 px-6 flex flex-col items-center justify-center overflow-hidden">
      {/* Floating blobs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-emerald-200 rounded-full blur-3xl animate-pulse"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute bottom-[-120px] left-[-120px] w-[450px] h-[450px] bg-cyan-200 rounded-full blur-3xl animate-pulse"
      />

      {/* Form Card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md p-8 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-emerald-100"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          Patient Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 font-semibold rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-lg transition-transform duration-300"
          >
            Login
          </motion.button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
        )}
        {success && (
          <p className="mt-4 text-sm text-green-600 text-center">{success}</p>
        )}
      </motion.div>
    </div>
  );
}

export default Patientlogin;
