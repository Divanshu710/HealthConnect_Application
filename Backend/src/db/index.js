import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { Doctor } from "../models/doctor.models.js";
import bcrypt from "bcrypt"
const connectDB = async()=>{
    try {
        const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected ! DB host : ${connectionInstance.connection.host}`)
        
    } catch (error) {
        console.log("MongoDB Connection error",error)
        process.exit(1)
    }
};

// const addDoctor = async () => {
//     try {
//         const hashedPassword = await bcrypt.hash("doctor123", 10);

//         const doctor = await Doctor.create({
//    username: "drhall",
//     password: "doctor123",
//     name: "Dr. Karen Hall",
//     specialization: "Radiologist",
//     email: "drhall@example.com",
//     phone: "9876543219",
//         });

//         console.log("Doctor inserted:", doctor.username);
//     } catch (err) {
//         console.log("Error adding doctor:", err.message);
//     }
// };
//  addDoctor()
export default connectDB;
