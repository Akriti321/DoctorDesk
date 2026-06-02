import prescriptionModel from "../models/prescriptionModel.js";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";

// Create Prescription
const createPrescription = async (req, res) => {
    try {

        const {
            docId,
            appointmentId,
            medicines,
            notes
        } = req.body;

        const appointmentData =
            await appointmentModel.findById(
                appointmentId
            );

        if (!appointmentData) {
            return res.json({
                success: false,
                message: "Appointment not found"
            });
        }

        if (
            appointmentData.docId.toString() !==
            docId.toString()
        ) {
            return res.json({
                success: false,
                message: "Unauthorized"
            });
        }

        const existingPrescription =
            await prescriptionModel.findOne({
                appointmentId
            });

        if (existingPrescription) {

            existingPrescription.medicines =
                medicines;

            existingPrescription.notes =
                notes;

            await existingPrescription.save();

            return res.json({
                success: true,
                message:
                    "Prescription Updated",
                prescription:
                    existingPrescription
            });
        }

        const prescriptionData = {
            appointmentId,
            docId,
            userId:
                appointmentData.userId,
            medicines,
            notes,
            date: Date.now()
        };

        const prescription =
            await prescriptionModel.create(
                prescriptionData
            );

        res.json({
            success: true,
            message: "Prescription Saved",
            prescription
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};


// Get Prescription by Appointment
const getPrescription = async (req, res) => {
    try {

        const { appointmentId } = req.params;

        const prescription =
            await prescriptionModel.findOne({
                appointmentId
            });

        if (!prescription) {
            return res.json({
                success: false,
                message:
                    "Prescription not found"
            });
        }

        const doctor =
            await doctorModel.findById(
                prescription.docId
            );

        const patient =
            await userModel.findById(
                prescription.userId
            );

        res.json({
            success: true,
            prescription,

            doctorName:
                doctor?.name || "Doctor",

            speciality:
                doctor?.speciality ||
                "General",

            patientName:
                patient?.name ||
                "Patient"
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

export {
    createPrescription,
    getPrescription
};