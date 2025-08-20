import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import Razorpay from "razorpay"
import dotenv from "dotenv"
import fs from 'fs'
import path from 'path'
import bodyParser from "body-parser"
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: "./.env"
})

const app= express();

//const bodyParser=require('body-parser')

app.use(cors());
//common middlewares

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookieParser())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const readData = () => {
  if (fs.existsSync('orders.json')) {
    const data = fs.readFileSync('orders.json');
    return JSON.parse(data);
  }
  return [];
};

const writeData = (data) => {
  fs.writeFileSync('orders.json', JSON.stringify(data, null, 2));
};

if (!fs.existsSync('orders.json')) {
  writeData([]);
}

app.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    if (!amount || !receipt) {
      return res.status(400).json({ message: 'Amount and receipt are required.' });
    }

    const options = {
      amount: amount * 100, // amount in paise (₹ * 100)
      currency,
      receipt,
      notes,
    };
    const order = await razorpay.orders.create(options);

    const orders = readData();

    orders.push({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: 'created',
    });
    writeData(orders);

    // Respond with order details for frontend
    return res.status(201).json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error creating order');
  }
});

app.get('/payment-success', (req, res) => {
  res.sendFile(path.join(__dirname, 'success.html'));
});

import healthcheckrouter from "./routes/healthcheck.routes.js";
import patientRouter from "./routes/patient.routes.js"
import doctorRouter from "./routes/doctor.routes.js"
import appointmentRouter from "./routes/appointment.routes.js"
//routes

app.use("/api/v1/healthcheck",healthcheckrouter)
app.use("/api/v1/patient",patientRouter)
app.use("/api/v1/doctor",doctorRouter)
app.use("/api/v1/appointments",appointmentRouter)
export {app}