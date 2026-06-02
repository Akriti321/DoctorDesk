import express from "express";
import authDoctor from "../middleware/authDoctor.js";

import {
    createPrescription,
    getPrescription
} from "../controllers/prescriptionController.js";

const prescriptionRouter = express.Router();

prescriptionRouter.post(
    "/create",
    authDoctor,
    createPrescription
);

prescriptionRouter.get(
    "/:appointmentId",
    getPrescription
);

export default prescriptionRouter;