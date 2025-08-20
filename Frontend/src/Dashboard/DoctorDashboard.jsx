import React, { useContext } from 'react';
import Headerdoctor from '../Pages/Headerdoctor';
import { useNavigate } from 'react-router-dom';
import { AuthContextDoctor } from '../ContextAPI/AuthContextDoctor';
import { CalendarDays, History, UserCog } from "lucide-react"; // nice icons

function DoctorDashboard() {
  const navigate = useNavigate();
  const { doctor } = useContext(AuthContextDoctor);

  const cardInfo = [
    {
      title: 'View Appointments',
      description: 'See all your scheduled appointments.',
      icon: <CalendarDays className="w-10 h-10 mb-4 text-emerald-700" />,
      onClick: () => navigate(`/doctor/${doctor}/appointments`),
    },
    {
      title: 'History',
      description: 'View appointments history.',
      icon: <History className="w-10 h-10 mb-4 text-emerald-700" />,
      onClick: () => navigate(`/doctor/${doctor}/history-appointments`),
    },
    {
      title: 'Update Profile',
      description: 'Edit your profile and availability details.',
      icon: <UserCog className="w-10 h-10 mb-4 text-emerald-700" />,
      onClick: () => alert(`Feature in making. Will be available soon!`),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Headerdoctor />
      <main className="flex-grow max-w-6xl mx-auto py-12 px-6">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-12 text-center">
          Doctor Dashboard
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cardInfo.map((card) => (
            <div
              key={card.title}
              onClick={card.onClick}
              className="cursor-pointer bg-gradient-to-br from-emerald-100 to-green-50 p-8 rounded-2xl shadow-md 
                         hover:shadow-xl hover:scale-105 transition-transform duration-300 flex flex-col 
                         items-center text-center"
            >
              {card.icon}
              <h3 className="text-xl font-bold text-gray-800 mb-2">{card.title}</h3>
              <p className="text-sm text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default DoctorDashboard;
