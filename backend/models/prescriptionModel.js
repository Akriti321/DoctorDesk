import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({

    appointmentId: {
        type: String,
        required: true
    },

    docId: {
        type: String,
        required: true
    },

    userId: {
        type: String,
        required: true
    },

    medicines: [
        {
            name: String,
            dosage: String,
            frequency: String
        }
    ],

    notes: {
        type: String,
        default: ""
    },

    date: {
        type: Number,
        default: Date.now
    }

});

const prescriptionModel =
    mongoose.models.prescription ||
    mongoose.model(
        "prescription",
        prescriptionSchema
    );

export default prescriptionModel;