import { Router } from "express";
import { loginDoctor,logoutDoctor,getDoctorProfile, getallDoctors, getidbydoctor, getdoctorbyid } from "../controllers/doctor.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router=Router();

router.route("/login").post(loginDoctor);
router.route("/logout").post(logoutDoctor);
router.route("/profile").get(verifyJWT,getDoctorProfile);
router.route("/alldoctors").get(getallDoctors)
router.route("/:patient/:doctorName/book-appointment").get(getidbydoctor)
router.route("/:doctorid/getdoctorname").get(getdoctorbyid)

export default router