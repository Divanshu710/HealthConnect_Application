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
    paymentId: {
      type: String,
      default: null
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending"
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending"
    }
  },
  { timestamps: true }
);

// Unique compound index to prevent double-booking at the database level
// This is the database-enforced "lock" — MongoDB guarantees no two docs
// can have the same doctorId + date + timeslot combination
appointmentSchema.index({ doctorId: 1, date: 1, timeslot: 1 }, { unique: true });
    

export const Appointment= mongoose.model("Appointment",appointmentSchema)