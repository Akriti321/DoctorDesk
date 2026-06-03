import chatModel from "../models/chatModel.js";
import appointmentModel from "../models/appointmentModel.js";

// Create Chat
const createChat = async (req, res) => {

    try {

        const { appointmentId } = req.body;

        const appointment =
            await appointmentModel.findById(
                appointmentId
            );

        if (!appointment) {
            return res.json({
                success: false,
                message: "Appointment not found"
            });
        }

        const existingChat =
            await chatModel.findOne({
                appointmentId
            });

        if (existingChat) {
            return res.json({
                success: true,
                chat: existingChat
            });
        }

        const chat =
            await chatModel.create({
                appointmentId,
                doctorId:
                    appointment.docId,
                patientId:
                    appointment.userId,
                messages: []
            });

        res.json({
            success: true,
            chat
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: error.message
        });
    }
};
// Send Message
const sendMessage = async (req, res) => {

    try {

        const {
            appointmentId,
            senderId,
            senderType,
            text
        } = req.body;

        let chat = await chatModel.findOne({
    appointmentId
});

if (!chat) {

    const appointment =
        await appointmentModel.findById(
            appointmentId
        );

    chat = await chatModel.create({
        appointmentId,
        doctorId: appointment.docId,
        patientId: appointment.userId,
        messages: []
    });

}

        chat.messages.push({
            senderId,
            senderType,
            text
        });

        await chat.save();

        res.json({
            success: true,
            message: "Message Sent"
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: error.message
        });
    }
};
const getMessages = async (req, res) => {

    try {

        const { appointmentId } = req.params;

        const chat =
            await chatModel.findOne({
                appointmentId
            });

        if (!chat) {
            return res.json({
                success: false,
                message: "Chat not found"
            });
        }

        res.json({
            success: true,
            messages: chat.messages
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
    createChat,
    sendMessage,
    getMessages
};