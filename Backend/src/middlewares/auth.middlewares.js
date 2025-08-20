import jwt from "jsonwebtoken";
import { Patient } from "../models/patient.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Doctor } from "../models/doctor.models.js";


export const verifyJWT = asyncHandler(async (req, _ , next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        throw new ApiError(401, "Unauthorized: No token provided");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        let user;
        if(decoded.role==="patient"){
            user=await Patient.findById(decoded.id).select("-password")
        }
        if(decoded.role==="doctor"){
            user = await Doctor.findById(decoded.id).select("-password");
        }
        if (!user) {
            throw new ApiError(401, "Unauthorized: User not found");
        }
        req.user = user;
        next();
    } 
    catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }

});
