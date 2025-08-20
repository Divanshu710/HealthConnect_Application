import mongoose from "mongoose";
import bcrypt from "bcrypt";
import connectDB from "./index.js";
import { Doctor } from "../models/doctor.models.js";

const doctorsData = [
  {
    username: "drsmith",
    password: "doctor123",
    name: "Dr. John Smith",
    specialization: "Cardiologist",
    email: "drsmith@example.com",
    phone: "9876543210",
  },
  {
    username: "drjones",
    password: "doctor123",
    name: "Dr. Emily Jones",
    specialization: "Dermatologist",
    email: "drjones@example.com",
    phone: "9876543211",
  },
  {
    username: "drbrown",
    password: "doctor123",
    name: "Dr. Michael Brown",
    specialization: "Neurologist",
    email: "drbrown@example.com",
    phone: "9876543212",
  },
  {
    username: "drwilliams",
    password: "doctor123",
    name: "Dr. Linda Williams",
    specialization: "Pediatrician",
    email: "drwilliams@example.com",
    phone: "9876543213",
  },
  {
    username: "drtaylor",
    password: "doctor123",
    name: "Dr. David Taylor",
    specialization: "Orthopedist",
    email: "drtaylor@example.com",
    phone: "9876543214",
  },
  {
    username: "drthomas",
    password: "doctor123",
    name: "Dr. Susan Thomas",
    specialization: "Psychiatrist",
    email: "drthomas@example.com",
    phone: "9876543215",
  },
  {
    username: "drlee",
    password: "doctor123",
    name: "Dr. James Lee",
    specialization: "Oncologist",
    email: "drlee@example.com",
    phone: "9876543216",
  },
  {
    username: "drmartin",
    password: "doctor123",
    name: "Dr. Nancy Martin",
    specialization: "Gynecologist",
    email: "drmartin@example.com",
    phone: "9876543217",
  },
  {
    username: "drclark",
    password: "doctor123",
    name: "Dr. Robert Clark",
    specialization: "Endocrinologist",
    email: "drclark@example.com",
    phone: "9876543218",
  },
  {
    username: "drhall",
    password: "doctor123",
    name: "Dr. Karen Hall",
    specialization: "Radiologist",
    email: "drhall@example.com",
    phone: "9876543219",
  },
];

async function seedDoctors() {
  try {
    await connectDB();

    // Clear existing doctors if you want a fresh seed
    await Doctor.deleteMany({});

    for (const doc of doctorsData) {
      const hashedPassword = await bcrypt.hash(doc.password, 10);
      await Doctor.create({
        username: doc.username,
        password: hashedPassword,
        name: doc.name,
        specialization: doc.specialization,
        email: doc.email,
        phone: doc.phone,
      });
      console.log(`Inserted doctor: ${doc.username}`);
    }

    console.log("All doctors seeded successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding doctors:", err);
    process.exit(1);
  }
}

seedDoctors();
