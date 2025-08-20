import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Patient } from "../models/patient.models.js";
import {Appointment} from "../models/appointment.models.js";
import { Doctor } from "../models/doctor.models.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const registerPatient = asyncHandler(async (req, res) => {

    const { username, aadhar_id, password, gender, age, contactno, email, medical_history } = req.body

    if (!username || !aadhar_id || !password || !gender || !age || !contactno) {
        throw new ApiError(404, "Some fields are mandatory");
    }
    //checking if Patient already exists
    const existedPatient = await Patient.findOne({
        $or: [{ aadhar_id }, { username }]
    })
    if (existedPatient) {
        throw new ApiError(409, "Patient already exists")
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const patientinstance = await Patient.create({
            username,
            aadhar_id,
            password: hashedPassword,
            gender,
            age,
            contactno,
            email,
            medical_history
        })

        //checking if the patientinstance is created successfully or not
        const createdPatient = await Patient.findById(patientinstance._id);

        if (!createdPatient) {
            throw new ApiError(400, "Something went wrong while registering the patient")
        }
        return res
            .status(200)
            .json(new ApiResponse(200, createdPatient, "Patient Registered successfully"));

    } catch (error) {
        console.log(error)
    }
})

const loginPatient = asyncHandler(async (req, res) => {
    
        const { username, password } = req.body;
        if (!username || !password) {
            throw new ApiError(400, "All fields are required");
        }
        //checking if the patient data exist in DB
        
        const patient = await Patient.findOne({ username })

        if (!patient) {
            throw new ApiError(404, "Patient not found");
        }

        const isPasswordValid = await bcrypt.compare(password, patient.password);

        if (!isPasswordValid) {
            throw new ApiError(400, "Invalid credentials");
        }
        try{
        const loggedInPatient = await Patient.findById(patient._id).select("-password");
        const token=jwt.sign(
            {id:patient._id,role:"patient"},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        )
        
        return res
            .status(200)
            .cookie("accessToken",token,
                {httpOnly:true,
                    secure:process.env.NODE_ENV ==="production"
                }
            )
            .json(new ApiResponse(
                200,
                loggedInPatient,
                "User logged in successfully"
            ))
    }
    catch (error) {
        console.log(error);
    }
})

const logoutPatient = asyncHandler(async(req, res)=>{
    try {
        return res
        .status(200)
        .clearCookie("accessToken",{
            httpOnly:true,
            secure: process.env.NODE_ENV ==="production"
        })
        .json( new ApiResponse(200,{},"Patient logged out successfully"))
    } catch (error) {
        
    }
})

const getPatientProfile = asyncHandler(async(req,res)=>{
    return res.status(200).json(new ApiResponse(200,req.user,"Current Patient details"))
})




const getidbyusername=asyncHandler(async(req,res)=>{
      const {patient: patientUsername,doctorName}=req.params;
  //console.log(patientUsername);
  
      if(!patientUsername){
        throw new ApiError(404,"Patient not found!");
      }
      const patient=await Patient.findOne({username: patientUsername.trim()});
      try {
        if(!patient){
            throw new ApiError(400,"No Patient exist");
        }
        return res
        .status(200)
        .json(new ApiResponse(200,
            {id:patient._id},
            "Id fetched"
        ))
      } catch (error) {
        console.log(error)
      }
})
const getpatientnamebyid=asyncHandler(async(req,res)=>{
    const {patientId}=req.params;
    if(!patientId){
        throw new ApiError(404,'No Patient found');
    }
   try {
     const patient_instance=await Patient.findById(patientId);
     if(!patient_instance){
         throw new ApiError(409,'No patient matching to the id');
     }
     const name=patient_instance.username;
     return res
     .status(200)
     .json(new ApiResponse(200,name,'Patient name fetched successfully'));
   } catch (error) {
        console.log(error);
   }
})
//update profile function

export {
    registerPatient,
    loginPatient,
    logoutPatient,
    getPatientProfile,
    getidbyusername,
    getpatientnamebyid
}