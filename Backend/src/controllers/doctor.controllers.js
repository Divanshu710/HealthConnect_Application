import { Doctor } from "../models/doctor.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const loginDoctor = asyncHandler(async(req,res)=>{
        const {username,password}=req.body;
        if(!username || !password){
            throw new ApiError(404,"All fields are required");
        }
        const doctor= await Doctor.findOne({username});
        if(!doctor){
            throw new ApiError(409,"Username does not exist");
        }
        
      //  const isPasswordValid=await bcrypt.compare(password,doctor.password);
        if(password!=doctor.password){
            throw new ApiError(400,"Invalid credentials");
        }
         try {
        const token= jwt.sign(
            {id:doctor._id,role:"doctor"},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        )
        const loggedInDoctor = await Doctor.findById(doctor._id).select("-password");

        return res
        .status(200)
        .cookie("accessToken",token,
            {
                httpOnly:true,
                secure: process.env.NODE_ENV==="production"
            }
        )
        .json(new ApiResponse(200,
            loggedInDoctor,
            "Doctor logged in successfully"
        ))
    } catch (error) {
        console.log(error)
    }
})

const logoutDoctor= asyncHandler(async(req,res)=>{
    try {
        return res
        .status(200)
        .clearCookie("accessToken",{
            httpOnly:true,
            secure: process.env.NODE_ENV==="production"
        })

        .json( new ApiResponse(200,{},"Doctor logged out successfully"));
    } catch (error) {
        console.log(error);
    }
})

const getallDoctors = asyncHandler(async(req,res)=>{
    
    try {
        const data=await Doctor.find({}, "name specialization")
       // console.log(data);
        return res
        .status(200)
        .json(new ApiResponse(200,{data},"Doctor data fetched successfully"));
    } catch (error) {
        console.log(error);
    }
})

const getidbydoctor=asyncHandler(async(req,res)=>{
          const {patient: patientUsername,doctorName}=req.params;
         // console.log(patientUsername);
          if(!doctorName){
            console.log('error occuring');
            throw new ApiError(404,"Patient not found!");
          }
          const doctor=await Doctor.findOne({name: doctorName.trim()});
          try {
            if(!doctor){
                throw new ApiError(400,"No Doctor exist");
            }
            return res
            .status(200)
            .json(new ApiResponse(200,
                {id:doctor._id},
                "Id fetched"
            ))
          } catch (error) {
            console.log(error)
          }
})

const getdoctorbyid=asyncHandler(async(req,res)=>{
    const {doctorid}=req.params;
    if(!doctorid){
        throw new ApiError(404,'No doctor found');
    }
    
    try {
        const doctor_instance=await Doctor.findById(doctorid);
        console.log(doctor_instance)
        const name=doctor_instance.name;

        return res
        .status(200)
        .json(new ApiResponse(200,name,"Doctor name fetched"));
    } catch (error) {
        console.log(error);
    }
})

const getDoctorProfile=asyncHandler(async(req,res)=>{
    return res.status(200).json(new ApiResponse(200,req.user,"Current Doctor Profile"))
})


export{
    loginDoctor,
    logoutDoctor,
    getDoctorProfile,
    getallDoctors,
    getidbydoctor,
    getdoctorbyid
}
