import React from "react";
import { UserPlus, LogIn, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white to-emerald-50 px-6 overflow-hidden flex flex-col items-center justify-center">
      {/* Floating Blobs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-emerald-200 rounded-full blur-3xl animate-pulse"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute bottom-[-120px] left-[-120px] w-[450px] h-[450px] bg-cyan-200 rounded-full blur-3xl animate-pulse"
      />

      {/* Main Section */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center"
      >
        <h1 className="text-6xl font-extrabold mb-4 text-gray-800 drop-shadow-lg">
          HealthConnect Portal
        </h1>
        <p className="text-lg text-gray-600 mb-12 max-w-xl mx-auto leading-relaxed">
          A modern platform for patients and doctors to connect securely, 
          anytime and anywhere.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto relative z-10">
        {[
          {
            title: "Patient Registration",
            desc: "Register and create your health profile.",
            icon: <UserPlus className="w-10 h-10 mx-auto mb-4" />,
            click: () => navigate("/patient-register"),
          },
          {
            title: "Patient Login",
            desc: "Access your records and appointments.",
            icon: <LogIn className="w-10 h-10 mx-auto mb-4" />,
            click: () => navigate("/patient-login"),
          },
          {
            title: "Doctor Login",
            desc: "Manage patients and consultations.",
            icon: <Stethoscope className="w-10 h-10 mx-auto mb-4" />,
            click: () => navigate("/doctor-login"),
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.3 }}
            whileHover={{ scale: 1.08, rotate: 1 }}
            className="group bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-8 rounded-3xl shadow-xl text-white cursor-pointer hover:shadow-2xl transition-transform duration-300"
            onClick={card.click}
          >
            <motion.div
              whileHover={{ scale: 1.2, rotate: 5 }}
              className="flex justify-center"
            >
              {card.icon}
            </motion.div>
            <h3 className="text-2xl font-semibold">{card.title}</h3>
            <p className="text-sm mt-3 text-gray-100">{card.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative z-10 mt-20 text-gray-500 text-sm"
      >
        © 2025 HealthConnect Portal. All rights reserved.
      </motion.footer>
    </div>
  );
}

export default LandingPage;
