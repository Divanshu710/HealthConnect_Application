import { Appointment } from "../models/appointment.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Doctor } from "../models/doctor.models.js";
import { Patient } from "../models/patient.models.js";

const bookappointment = asyncHandler(async (req, res) => {
  const {
    patientId,
    doctorId,
    date,
    timeslot,
    reason,
    paymentId,
    paymentStatus = "pending",  // default to pending before payment confirmation
  } = req.body;

  if (!date || !timeslot) {
    throw new ApiError(409, "Date and Timeslot are mandatory");
  }

  const isdoctorbusy = await Appointment.findOne({
    doctorId,
    date,
    timeslot,
  });

  if (isdoctorbusy) {
    throw new ApiError(409, "Select any other slot");
  }

  try {
    const bookingappoint = await Appointment.create({
      patientId,
      doctorId,
      date,
      timeslot,
      reason,
      paymentId,
      paymentStatus,
      status: paymentStatus === "paid" ? "confirmed" : "pending",
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { createdappointment: bookingappoint }, "Appointment booked successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Booking failed");
  }
});


  const isbookingpossible=asyncHandler(async(req,res)=>{
        const {doctorId,date,timeslot}=req.body;
        try {
          const alreadybooked= await Appointment.findOne({
            doctorId,date,timeslot
          })
          let canbook=true;
          if(alreadybooked){
            canbook=false;
          }
          return res
          .status(200)
          .json(new ApiResponse(200, {canbook} , "Success"));
        } catch (error) {
            console.log(error);
        }
   })

const getappointmentbypatient=asyncHandler(async(req,res)=>{
        const {patient}=req.params;
        if(!patient){
            throw new ApiError(404,"Error finding patient");
        }
        const p=await Patient.findOne({username:patient});
        if(!p){
            throw new ApiError(404,"Patient not found");
        }
        
       try {
         const appointments=await Appointment.find({patientId:p._id}).sort({date:1});

         return res
         .status(200)
         .json(new ApiResponse(200,{appointments},"Appointments fetched successfully"));

        } catch (error) {
        console.log(error);
       }
})


const getappointmentbydoctor = asyncHandler(async(req,res)=>{
    const {doctor}=req.params;
    if(!doctor){
        throw new ApiError(404,"Error finding doctor");
    }
    const d=await Doctor.findOne({username: doctor});
    if(!d){
        throw new ApiError(400,"Doctor not found")
    }
   try {
     const appointments= await Appointment.find({doctorId:d._id}).sort({date:1});
      return res
          .status(200)
          .json(new ApiResponse(200,{appointments},"Appointments fetched successfully"));
   } catch (error) {
       console.log(error);
   }
})

const cancelappointment=asyncHandler(async(req,res)=>{

})

export {
   bookappointment,
   getappointmentbypatient,
   getappointmentbydoctor,
   cancelappointment,
   isbookingpossible
}