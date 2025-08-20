import { Router } from "express";
import { bookappointment, getappointmentbypatient, getappointmentbydoctor, isbookingpossible } from "../controllers/appointment.controllers.js";

const router=Router();

router.route("/bookappointment").post(bookappointment);
router.route("/:patient/getappointments").get(getappointmentbypatient);
router.route("/:doctor/getappointmentsbydoctor").get(getappointmentbydoctor);
router.route("/isbookingpossible").post(isbookingpossible)
export default router