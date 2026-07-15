import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import axios from "axios";

export const patientAssistantChat = asyncHandler(async(req, res)=>{
    const {patientUsername, message, threadId} = req.body

    if(!patientUsername || !message){
        throw new ApiError(400, "patient username and message are required");
    }

    const aiBaseUrl = process.env.PYTHON_AI_SERVICE_URL || "http://localhost:8000";

    // calling python api
    const aiResponse = await axios.post(`${aiBaseUrl}/patient-assistant`,{
        patientUsername,
        message,
        threadId
    });

    if(aiResponse.status !== 200){
        throw new ApiError(502, "Ai service failed to respond");
    }
    const data = aiResponse.data;

    return res.status(200).json(
        new ApiResponse(200,data, "Ai response fetched successfully")
    );
});