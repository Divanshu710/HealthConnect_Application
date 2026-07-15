import { Router } from "express";
import { patientAssistantChat } from "../controllers/chat.controllers.js";

const router = Router();

router.route("/patient-assistant").post(patientAssistantChat);

export default router
