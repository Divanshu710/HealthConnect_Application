import React, { useContext } from 'react';
import { AuthContextDoctor } from '../ContextAPI/AuthContextDoctor';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

function Headerdoctor() {
  const { doctor, setDoctor } = useContext(AuthContextDoctor);
  const navigate = useNavigate();

  const handleLogout = () => {
    setDoctor(null);
    navigate('/');
  };

  const handledashboard = () => {
    navigate(`/doctor/${doctor}/doctor-dashboard`);
  };

  return (
    <header className="w-full flex justify-between items-center px-6 py-4 bg-white shadow-sm border-b border-gray-200">
      {/* Left - Dashboard button */}
      <button
        onClick={handledashboard}
        className="px-4 py-2 bg-emerald-500 text-white font-medium rounded-lg 
                   hover:bg-emerald-600 transition-all duration-200 shadow-sm"
      >
        Dashboard
      </button>

      {/* Right - Doctor Info + Logout */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
          <User className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold text-gray-800">
            {doctor || 'Guest'}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg 
                     hover:bg-red-600 transition-all duration-200 shadow-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Headerdoctor;
