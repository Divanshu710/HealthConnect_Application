import React, { useContext } from 'react';
import Headerpatient from '../Pages/Headerpatient';
import { useNavigate } from 'react-router-dom';
import { AuthContextPatient } from '../ContextAPI/AuthContextPatient';
import { motion } from "framer-motion";

function PatientDashboard() {
  const navigate = useNavigate();
  const { patient } = useContext(AuthContextPatient);

  const cardInfo = [
    {
      title: 'Book Appointment',
      description: 'Schedule a new appointment with your doctor.',
      onClick: () => navigate(`/patient/${patient}/book-appointment`),
    },
    {
      title: 'Upcoming Appointments',
      description: 'View your upcoming appointments.',
      onClick: () => navigate(`/patient/${patient}/upcoming-appointments`),
    },
    {
      title: 'History',
      description: 'View your past appointments and treatments.',
      onClick: () => navigate(`/patient/${patient}/history`),
    },
    {
      title: 'Add Medical Reports',
      description: 'Upload your recent medical reports.',
      onClick: () => alert('Feature in making. Will be available soon!'),
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white to-emerald-50 flex flex-col overflow-hidden">
      <Headerpatient />

      {/* Floating blobs for decoration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute top-[-120px] left-[-100px] w-[400px] h-[400px] bg-emerald-200 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 2, delay: 0.3 }}
        className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] bg-cyan-200 rounded-full blur-3xl"
      />

      <main className="relative z-10 flex-grow max-w-6xl mx-auto py-12 px-6">
        <motion.h1
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-5xl font-extrabold text-gray-900 mb-6 text-center tracking-wide drop-shadow-lg"
        >
          Patient Dashboard
        </motion.h1>
        
        {/* Welcome message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xl text-gray-700 mb-12"
        >
          Welcome, <span className="font-semibold text-emerald-600">{patient || 'Guest'}</span> 👋
        </motion.p>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {cardInfo.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.3 }}
              whileHover={{ scale: 1.08, rotate: 1 }}
              onClick={card.onClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && card.onClick()}
              className="cursor-pointer bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-600 p-8 rounded-3xl shadow-xl transform transition-transform duration-50 flex flex-col items-center text-center text-white select-none"
            >
              <h3 className="text-2xl font-bold mb-4 tracking-wide drop-shadow-lg">
                {card.title}
              </h3>
              <p className="text-sm font-light max-w-xs leading-relaxed drop-shadow-md">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default PatientDashboard;
