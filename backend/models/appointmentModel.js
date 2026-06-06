import mongoose from "mongoose"



const appointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    docId: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    docData: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    
    isCompleted: { type: Boolean, default: false },
   prescription: {
    medicines: [
        {
            name: String,
            dosage: String,
            frequency: String
        }
    ],

    notes: String,

    createdAt: {
        type: Number,
        default: Date.now
    }
}
})

// appointmentSchema.index
// (
// {
//     docId: 1,
//     slotDate: 1,
//     slotTime: 1
// },
// {
//     unique: true
// }
// )
appointmentSchema.index(
{
    docId: 1,
    slotDate: 1,
    slotTime: 1
},
{
    unique: true,
    partialFilterExpression: {
        cancelled: false
    }
}
)


const appointmentModel = mongoose.models.appointment || mongoose.model("appointment", appointmentSchema)
export default appointmentModel