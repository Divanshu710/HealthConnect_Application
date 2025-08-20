import mongoose, { Schema } from "mongoose";

const doctorSchema = new Schema(
  {
    id: {
      type: Number,
      unique: true
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    username: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: [true, "password is required"]
    },
    
    specialization: {
      type: String,
      trim: true,
      default: ""
    },
    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Invalid email address']
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\d{10}$/, 'Invalid phone number']
    }
    },
  { timestamps: true }
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
