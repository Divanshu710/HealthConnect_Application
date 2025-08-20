import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Headerpatient from "../Pages/Headerpatient";
import { AuthContextPatient } from "../ContextAPI/AuthContextPatient";
import { Stethoscope } from "lucide-react"; // doctor icon

//const API = "http://localhost:5000/api/v1/doctor/alldoctors";
const API = "https://codes-k5ka.onrender.com/api/v1/doctor/alldoctors";
function Bookappointments() {
  const [doctors, setDoctors] = useState([]);
  const { patient } = useContext(AuthContextPatient);
  const navigate = useNavigate();

  useEffect(() => {
    const getdoctors = async () => {
      try {
        const res = await axios.get(API);
        setDoctors(res.data.data.data); // nested doctors array
      } catch (error) {
        console.log(error);
      }
    };
    getdoctors();
  }, []);

  return (
    <div>
      <Headerpatient />
      <div className="min-h-screen bg-gray-50 px-6 py-12 flex flex-col items-center">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-wide">
          Choose a Doctor
        </h1>
        <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl">
          Browse through our list of qualified doctors and book your appointment
          with ease.
        </p>

        {/* Doctor cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl w-full">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              onClick={() =>
                navigate(`/patient/${patient}/${doctor.name}/book-appointment`)
              }
              className="cursor-pointer bg-white border border-gray-200 rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <Stethoscope className="w-8 h-8" />
              </div>

              {/* Doctor Info */}
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {doctor.name}
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Specialization: </span>
                {doctor.specialization || "General"}
              </p>
              <p className="text-sm text-gray-500">
                {doctor.experience
                  ? `${doctor.experience} years experience`
                  : "Experienced Doctor"}
              </p>

              {/* Button */}
              <button className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition">
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Bookappointments;
