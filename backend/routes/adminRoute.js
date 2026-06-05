import express from 'express';
import { loginAdmin, appointmentsAdmin, appointmentCancel, addDoctor, allDoctors, adminDashboard,pendingDoctors,approveDoctor,rejectDoctor,deleteDoctor,changeAvailablity } from '../controllers/adminController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';
const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin)
adminRouter.post("/add-doctor", authAdmin, upload.single('image'), addDoctor)
adminRouter.get("/appointments", authAdmin, appointmentsAdmin)
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel)
adminRouter.get("/all-doctors", authAdmin, allDoctors)
adminRouter.post("/change-availability", authAdmin, changeAvailablity)
adminRouter.get("/dashboard", authAdmin, adminDashboard)
adminRouter.get(
    "/pending-doctors",
    authAdmin,
    pendingDoctors
)

adminRouter.post(
    "/approve-doctor",
    authAdmin,
    approveDoctor
)

adminRouter.post(
    "/reject-doctor",
    authAdmin,
    rejectDoctor
)
adminRouter.delete(
    "/delete-doctor/:doctorId",
    authAdmin,
    deleteDoctor
)

export default adminRouter;