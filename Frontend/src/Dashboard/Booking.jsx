import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Headerpatient from '../Pages/Headerpatient';
import API_BASE_URL from '../config';

const TIMESLOTS = ['10-11', '11-12', '12-1', '1-2', '2-3', '3-4'];

function Booking() {
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
  const { patient, doctorName } = useParams();
  const location = useLocation();
  const draft = location.state?.bookingDraft;

  const [patientId, setPatientId] = useState(draft?.patientId || null);
  const [doctorId, setDoctorId] = useState(draft?.doctorId || null);
  const [date, setDate] = useState(draft?.date || '');
  const [timeslot, setTimeslot] = useState(draft?.timeslot || '');
  const [reason, setReason] = useState(draft?.reason || '');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loadingIds, setLoadingIds] = useState(!draft); // No loading if draft exists

  useEffect(() => {
    // If draft exists, skip API calls — all IDs are pre-filled
    if (draft) return;

    let cancelled = false;
    
    const getPatientId = async () => {
      try {
        const encodedDoctorName = encodeURIComponent(doctorName);
        const API = `${API_BASE_URL}/api/v1/patient/${patient}/${encodedDoctorName}/book-appointment`;
        const response = await axios.get(API);
        if (!cancelled) setPatientId(response.data.data.id);
      } catch (err) {
        console.log(err);
        if (!cancelled) setError('Failed to fetch patient info. Is the backend running?');
      }
    };

    const getDoctorId = async () => {
      try {
        const encodedDoctorName = encodeURIComponent(doctorName);
        const API = `${API_BASE_URL}/api/v1/doctor/${patient}/${encodedDoctorName}/book-appointment`;
        const response = await axios.get(API);
        if (!cancelled) setDoctorId(response.data.data.id);
      } catch (err) {
        console.log(err);
        if (!cancelled) setError('Failed to fetch doctor info. Is the backend running?');
      }
    };

    Promise.all([getPatientId(), getDoctorId()]).finally(() => {
      if (!cancelled) setLoadingIds(false);
    });

    return () => { cancelled = true; };
  }, [patient, doctorName, draft]);

  const isbookingpossible_API=`${API_BASE_URL}/api/v1/appointments/isbookingpossible`;

  const canbebooked=async()=>{
    try {
      const res=await axios.post(isbookingpossible_API,{
        doctorId,
        date,
        timeslot,
      })
      console.log(res.data.data.canbook);
      return res.data.data.canbook;
    } catch (error) {
       console.log(error);
    }
  }
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 3);
  const formatDate = (d) => d.toISOString().split('T')[0];

  const handlePayment = async () => {
    if (!window.Razorpay) {
    setError("Razorpay SDK not loaded yet. Please refresh and try again.");
    return;
   }
    try {
      const orderRes = await axios.post(`${API_BASE_URL}/create-order`, {
        amount: 200,
        currency: 'INR',
        receipt: `receipt_order_${Date.now()}`,
        notes: { patientId, doctorId, date, timeslot },
      });
      const options = {
        key: razorpayKey,
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: 'HealthConnect',
        description: 'Appointment Payment',
        order_id: orderRes.data.id,
        handler: async function (response) {
          try {
            await axios.post(`${API_BASE_URL}/api/v1/appointments/bookappointment`, {
              patientId,
              doctorId,
              date,
              timeslot,
              reason,
              paymentId: response.razorpay_payment_id,
              paymentStatus: 'paid',
            });
            setSuccess('✅ Payment successful! Appointment booked.');
            setError('');
            setDate('');
            setTimeslot('');
            setReason('');
          } catch (err) {
            setError('⚠️ Payment failed.');
            setSuccess('');
          }
        },
        prefill: { name: patient },
        theme: { color: '#10b981' }, // emerald
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on('payment.failed', (response) => {
        setError('❌ Payment failed: ' + response.error.description);
        setSuccess('');
      });
    } catch (err) {
      setError('Failed to initiate payment. Please try again.');
      setSuccess('');
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!date || !timeslot) {
      setError('Please select a date and timeslot');
      return;
    }
    if (!patientId || !doctorId) {
      setError('Loading patient or doctor info, please wait');
      return;
    }
    const canBook=await canbebooked();
    if(canBook){
       await handlePayment();
    }else{
      setError('Selected slot is already booked. Choose any other slot')
    }
  };

  return (
    <div>
      <Headerpatient />
      <div className="min-h-screen bg-gray-50 px-6 py-12 flex justify-center">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg border border-gray-200">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
            Book Appointment
          </h1>

          {/* Loading overlay while fetching IDs */}
          {loadingIds && (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm">Loading your details...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date */}
            <label className="block">
              <span className="font-medium text-gray-700">Select Date</span>
              <input
                type="date"
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-emerald-400 outline-none"
                min={formatDate(today)}
                max={formatDate(maxDate)}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>

            {/* Timeslot */}
            <label className="block">
              <span className="font-medium text-gray-700">Select Timeslot</span>
              <select
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-emerald-400 outline-none"
                value={timeslot}
                onChange={(e) => setTimeslot(e.target.value)}
                required
              >
                <option value="" disabled>
                  -- Select a timeslot --
                </option>
                {TIMESLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </label>

            {/* Reason */}
            <label className="block">
              <span className="font-medium text-gray-700">Reason</span>
              <textarea
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-emerald-400 outline-none"
                rows={3}
                placeholder="Optional"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loadingIds}
              className="w-full bg-gradient-to-br from-emerald-500 to-green-400 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loadingIds ? 'Loading patient info...' : 'Book Appointment & Pay'}
            </button>
          </form>

          {/* Status messages */}
          {success && <p className="mt-6 text-green-600 font-semibold text-center">{success}</p>}
          {error && <p className="mt-6 text-red-600 font-semibold text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Booking;
