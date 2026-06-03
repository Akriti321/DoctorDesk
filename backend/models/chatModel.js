import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },

    senderType: {
        type: String,
        required: true
    },

    text: {
        type: String,
        required: true
    },

    timestamp: {
        type: Date,
        default: Date.now
    }
});

const chatSchema = new mongoose.Schema({

    appointmentId: {
        type: String,
        required: true
    },

    doctorId: {
        type: String,
        required: true
    },

    patientId: {
        type: String,
        required: true
    },

    messages: [messageSchema]

}, { timestamps: true });

const chatModel =
    mongoose.models.chat ||
    mongoose.model("chat", chatSchema);

export default chatModel;