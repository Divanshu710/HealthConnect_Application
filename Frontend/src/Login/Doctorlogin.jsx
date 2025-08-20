import React,{useContext, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContextDoctor } from '../ContextAPI/AuthContextDoctor';
// const APi='http://localhost:5000/api/v1/doctor/login';
const APi='https://codes-k5ka.onrender.com/api/v1/doctor/login'

function Doctorlogin() {
    const navigate=useNavigate();
    const {setDoctor}=useContext(AuthContextDoctor);
   const [username,setUsername]=useState('');
   const [password,setPassword]=useState('');
   const [error,setError]=useState('');
   const [success,setSuccess]=useState('');

   useEffect(() => {
     if(success==='Login Successfull'){
        navigate(`/doctor/${username}/doctor-dashboard`);
     }
   }, [success])
   

   
   const handleSubmit = async(e)=>{
     e.preventDefault();
     try {
        const res = await axios.post(APi,{
            username,
            password,
        });
        console.log(res);
        setSuccess('Login Successfull')
        setDoctor(username);
     } catch (error) {
        console.log(error);
        if(error.response.status===400){
            setError('All fields are required')
        }else if(error.response.status===409){
            setError(`Doctor with username ${username} does not exist`);
        }else if(error.response.status===404){
            setError('Invalid Credentials');
        }else{
            setError(error.message || 'Something went wrong');
        }
     }
}

  return (
    <div className="relative min-h-screen bg-white px-6 flex flex-col items-center justify-center overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-emerald-100 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-120px] left-[-120px] w-[450px] h-[450px] bg-cyan-100 rounded-full blur-3xl"></div>

      {/* Form Card */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white rounded-3xl shadow-xl">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Doctor Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <button
            type="submit"
            className="w-full py-3 font-semibold rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-lg hover:scale-105 hover:shadow-2xl transition transform duration-300"
          >
            Login
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}
      </div>
    </div>
  )
}

export default Doctorlogin