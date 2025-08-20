import mongoose,{Schema} from "mongoose";

const appointmentSchema = new Schema({
    patientId: {           
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },
    doctorId: {             
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true
    },
    date: {                  
      type: Date,
      required: true
    },
    timeslot: {              
      type: String,
      required: true
    },
    reason: {                
      type: String,
      trim: true
    },
    },
      { timestamps: true }
    );
    

export const Appointment= mongoose.model("Appointment",appointmentSchema)