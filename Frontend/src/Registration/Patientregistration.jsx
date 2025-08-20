import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

const API = 'https://codes-k5ka.onrender.com/api/v1/patient/register';

function Patientregistration() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [aadharid, setAadharid] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [contactno, setContactno] = useState('');
  const [email, setEmail] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlelogin = () => {
    navigate('/patient-login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(API, {
        username,
        aadhar_id: aadharid,
        password,
        gender,
        age,
        contactno,
        email,
        medical_history: medicalHistory,
      })
      .then((res) => {
        setSuccess('Registration Successful!');
        setError('');
      })
      .catch((error) => {
        if (error.response?.status === 409) {
          setError('Patient already exists. Try logging in');
        } else if (error.response?.status === 404) {
          setError('Some fields are mandatory');
        } else {
          setError(error.message || 'Something went wrong');
        }
        setSuccess('');
      });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white to-emerald-50 px-6 flex flex-col items-center justify-center overflow-hidden">
      {/* Floating gradient blobs */}
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
          Patient Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <input
            type="text"
            placeholder="Aadhar ID"
            value={aadharid}
            onChange={e => setAadharid(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <select
            value={gender}
            onChange={e => setGender(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="" disabled>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>

          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={e => setAge(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <input
            type="text"
            placeholder="Contact No"
            value={contactno}
            onChange={e => setContactno(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <textarea
            placeholder="Medical History"
            value={medicalHistory}
            onChange={e => setMedicalHistory(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
          ></textarea>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 font-semibold rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-lg transition-transform duration-300"
          >
            Register
          </motion.button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
        )}
        {success && (
          <p className="mt-4 text-sm text-green-600 text-center">
            {success}{' '}
            <button onClick={handlelogin} className="font-bold text-emerald-600 hover:underline">
              Click here
            </button>{' '}
            for login
          </p>
        )}
      </motion.div>
    </div>
  );
}

export default Patientregistration;
