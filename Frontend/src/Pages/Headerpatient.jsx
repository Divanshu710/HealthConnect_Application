import React, { useContext } from 'react';
import { AuthContextPatient } from '../ContextAPI/AuthContextPatient';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

function Headerpatient() {
  const { patient, setPatient } = useContext(AuthContextPatient);
  const navigate = useNavigate();

  const handleLogout = () => {
    setPatient(null);
    navigate('/');
  };

  const handledashboard = () => {
    navigate(`/patient/${patient}/patient-dashboard`);
  };

  return (
    <header className="w-full flex justify-between items-center p-4 bg-white shadow-md">
      {/* Dashboard button */}
      <button
        onClick={handledashboard}
        className="px-3 py-1 bg-green-600 text-white font-bold rounded-md hover:bg-green-200 transition"
      >
        Dashboard
      </button>

      {/* User info + Logout */}
      <div className="flex items-center space-x-4">
        <User className="w-6 h-6 text-gray-600" />
        <span className="font-medium text-gray-800">{patient || 'Guest'}</span>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Headerpatient;
