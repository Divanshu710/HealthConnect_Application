import {Router} from "express";
import { registerPatient,loginPatient,logoutPatient,getPatientProfile,getidbyusername, getpatientnamebyid } from "../controllers/patient.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";


const router=Router();

router.route("/register").post(registerPatient);
router.route("/login").post(loginPatient)
router.route("/logout").post(logoutPatient)
router.route("/current-patient").get(verifyJWT,getPatientProfile)
router.route("/:patient/:doctorName/book-appointment").get(getidbyusername)
router.route("/:patientId/getpatientname").get(getpatientnamebyid)
export default router
