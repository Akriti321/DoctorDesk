import express from 'express';
import { loginDoctor, appointmentsDoctor, appointmentCancel, doctorList, changeAvailablity, appointmentComplete, doctorDashboard, doctorProfile, updateDoctorProfile,registerDoctor,updateProfileImage } from '../controllers/doctorController.js';
import authDoctor from '../middleware/authDoctor.js';
import upload from '../middleware/multer.js';
import { createPrescription, getPrescription } from '../controllers/prescriptionController.js';
const doctorRouter = express.Router();

doctorRouter.post("/login", loginDoctor)
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel)
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor)
doctorRouter.get("/list", doctorList)
doctorRouter.post("/change-availability", authDoctor, changeAvailablity)
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete)
doctorRouter.get("/dashboard", authDoctor, doctorDashboard)
doctorRouter.get("/profile", authDoctor, doctorProfile)
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile)
doctorRouter.post(
    "/add-prescription",
    authDoctor,
    createPrescription
)

doctorRouter.get(
    "/prescription/:appointmentId",
    getPrescription
)
doctorRouter.post(
    "/register",
    upload.fields([
        {
            name: "image",
            maxCount: 1
        },
        {
            name: "governmentId",
            maxCount: 1
        },
        {
            name: "medicalCertificate",
            maxCount: 1
        }
    ]),
    registerDoctor
)

doctorRouter.post(
    "/update-profile-image",
    authDoctor,
    upload.single("image"),
    updateProfileImage
);

export default doctorRouter;