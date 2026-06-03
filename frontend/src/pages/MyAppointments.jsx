import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import jsPDF from "jspdf"
import {io} from 'socket.io-client'
const MyAppointments = () => {
   const [socket, setSocket] = useState(null)
   const {
    backendUrl,
    token,
    userData
} = useContext(AppContext)
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([])
    const [payment, setPayment] = useState('')
    const [showChat, setShowChat] = useState(false)

    const [selectedAppointment, setSelectedAppointment] =
  useState(null)

    const [messages, setMessages] = useState([])

    const [messageText, setMessageText] =
  useState('')

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    // Getting User Appointments Data Using API
    const getUserAppointments = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            setAppointments(data.appointments.reverse())

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to cancel appointment Using API
    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                getUserAppointments()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Appointment Payment',
            description: "Appointment Payment",
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {

                console.log(response)

                try {
                    const { data } = await axios.post(backendUrl + "/api/user/verifyRazorpay", response, { headers: { token } });
                    if (data.success) {
                        navigate('/my-appointments')
                        getUserAppointments()
                    }
                } catch (error) {
                    console.log(error)
                    toast.error(error.message)
                }
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    // Function to make payment using razorpay
    const appointmentRazorpay = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })
            if (data.success) {
                initPay(data.order)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    



    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])
    useEffect(() => {

    const newSocket = io(backendUrl)

    setSocket(newSocket)

    return () => newSocket.disconnect()

}, [])
    useEffect(() => {

    if (!socket) return

    socket.on(
        "receive_message",
        (data) => {

            setMessages(prev => [
                ...prev,
                data
            ])

        }
    )

    return () => {
        socket.off("receive_message")
    }

}, [socket])
    const downloadPrescription = async (appointmentId) => {
    try {

        const { data } = await axios.get(
            backendUrl + `/api/doctor/prescription/${appointmentId}`
        )

        if (!data.success) {
            toast.error("Prescription not found")
            return
        }

        const prescription = data.prescription
        const doctorName = data.doctorName || "Doctor"
        const patientName = data.patientName || "Patient"
        const speciality = data.speciality || "General"

        const doc = new jsPDF()

        // ===== BORDER =====
        doc.setDrawColor(34, 197, 94)
        doc.setLineWidth(0.8)
        doc.rect(10, 10, 190, 277)

        // ===== HEADER =====
        doc.setTextColor(34, 197, 94)
        doc.setFont("helvetica", "bold")
        doc.setFontSize(24)

        doc.text("CareConnect", 70, 25)

        doc.setFont("helvetica", "normal")
        doc.setFontSize(10)
        doc.setTextColor(120)

        doc.text(
            "Digital Healthcare Platform",
            75,
            33
        )

        doc.setDrawColor(34, 197, 94)
        doc.line(15, 42, 195, 42)

        // ===== TITLE =====
        doc.setTextColor(0)
        doc.setFont("helvetica", "bold")
        doc.setFontSize(18)

        doc.text("PRESCRIPTION", 72, 58)

        // ===== DETAILS =====
        doc.setFont("helvetica", "normal")
        doc.setFontSize(12)

        doc.text(
            `Doctor : ${doctorName}`,
            20,
            78
        )

        doc.text(
            `Patient : ${patientName}`,
            110,
            78
        )

        doc.text(
            `Speciality : ${speciality}`,
            20,
            90
        )

        doc.text(
            `Date : ${new Date().toLocaleDateString()}`,
            110,
            90
        )

        doc.line(20, 102, 190, 102)

        // ===== MEDICINES =====
        doc.setFont("helvetica", "bold")
        doc.setFontSize(15)

        doc.text("Medicines", 20, 118)

        let y = 135

        prescription.medicines.forEach((med, index) => {

            doc.setFont("helvetica", "bold")

            doc.text(
                `${index + 1}. ${med.name}`,
                25,
                y
            )

            doc.setFont("helvetica", "normal")

            doc.text(
                `Dosage : ${med.dosage}`,
                40,
                y + 10
            )

            doc.text(
                `Frequency : ${med.frequency}`,
                40,
                y + 20
            )

            doc.line(
                25,
                y + 28,
                180,
                y + 28
            )

            y += 38
        })

        // ===== NOTES =====
        doc.setFont("helvetica", "bold")
        doc.setFontSize(15)

        doc.text(
            "Doctor Notes",
            20,
            y + 15
        )

        doc.setFont("helvetica", "normal")
        doc.setFontSize(12)

        const notes =
            prescription.notes ||
            "No notes provided"

        doc.text(
            notes,
            25,
            y + 30
        )

        // ===== SIGNATURE =====
        

        // ===== FOOTER =====
        doc.line(
            15,
            265,
            195,
            265
        )

        doc.setTextColor(120)
        doc.setFontSize(10)

        doc.text(
            "Generated by CareConnect Healthcare System",
            55,
            273
        )

        doc.save("Prescription.pdf")

    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }
}
const sendMessage = async () => {

    console.log("SEND BUTTON CLICKED")

    try {

        console.log("Selected Appointment:",
            selectedAppointment)

        console.log("User:",
            userData)

        console.log("Message:",
            messageText)

        const { data } = await axios.post(

            backendUrl + "/api/chat/send",

            {
                appointmentId:
                    selectedAppointment._id,

                senderId:
                    userData._id,

                senderType:
                    "patient",

                text:
                    messageText
            }

        )

        console.log("API RESPONSE:", data)

        if (data.success) {

    socket.emit(
        "send_message",
        {
            senderType: "patient",
            text: messageText
        }
    )

    setMessageText("")

    const msgData = await axios.get(
        backendUrl +
        `/api/chat/${selectedAppointment._id}`
    )

    if (msgData.data.success) {
        setMessages(
            msgData.data.messages
        )
    }

}

    } catch (error) {

        console.log("ERROR:", error)

    }


}
const loadMessages = async () => {

  try {

    const { data } = await axios.get(

      backendUrl +
      `/api/chat/${selectedAppointment._id}`

    )

    if (data.success) {

      setMessages(data.messages)

    }

  } catch (error) {

    console.log(error)

  }

}
      return (
        <div>
            <p className='pb-3 mt-12 text-lg font-medium text-gray-600 border-b'>My appointments</p>
            <div className=''>
                {appointments.map((item, index) => (
                    <div key={index} className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b'>
                        <div>
                            <img className='w-36 bg-[#EAEFFF]' src={item.docData.image} alt="" />
                        </div>
                        <div className='flex-1 text-sm text-[#5E5E5E]'>
                            <p className='text-[#262626] text-base font-semibold'>{item.docData.name}</p>
                            <p>{item.docData.speciality}</p>
                            <p className='text-[#464646] font-medium mt-1'>Address:</p>
                            <p className=''>{item.docData.address.line1}</p>
                            <p className=''>{item.docData.address.line2}</p>
                            <p className=' mt-1'><span className='text-sm text-[#3C3C3C] font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} |  {item.slotTime}</p>
                        </div>
                        <div></div>
                        <div className='flex flex-col gap-2 justify-end text-sm text-center'>
                            {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && <button onClick={() => setPayment(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>}
                            {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && <button onClick={() => appointmentRazorpay(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center'><img className='max-w-20 max-h-5' src={assets.razorpay_logo} alt="" /></button>}
                            {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border rounded text-[#696969]  bg-[#EAEFFF]'>Paid</button>}

                            {item.isCompleted &&
<>
<button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>
    Completed
</button>

<button
    onClick={() => downloadPrescription(item._id)}
    className='sm:min-w-48 py-2 border rounded bg-primary text-white'
>
    Download Prescription
</button>
<button
    onClick={async () => {

    setSelectedAppointment(item)

    setShowChat(true)

    const { data } = await axios.get(
        backendUrl + `/api/chat/${item._id}`
    )

    console.log(data)

    if (data.success) {
        setMessages(data.messages)
    }

}}
    className='sm:min-w-48 py-2 border rounded bg-primary text-white'
>
    Chat With Doctor
</button>
</>
}

                            {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel appointment</button>}
                            {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment cancelled</button>}
                        </div>
                    </div>
                ))}
            </div>
        {
  showChat && (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white w-[500px] rounded-lg p-5">

        <h2 className="text-xl font-semibold mb-4">
          Chat With Doctor
        </h2>

        <div className="border h-[300px] overflow-y-auto p-3 mb-3 rounded">

          {
            messages.length === 0
              ? (
                <p className="text-gray-400">
                  No messages yet
                </p>
              )
              : (
                messages.map((msg, index) => (

  <div
    key={index}
    className={`mb-3 flex ${
      msg.senderType === "patient"
        ? "justify-end"
        : "justify-start"
    }`}
  >

    <div
      className={`max-w-[70%] px-3 py-2 rounded-lg ${
        msg.senderType === "patient"
          ? "bg-primary text-white"
          : "bg-gray-200 text-black"
      }`}
    >

      <p className="text-xs mb-1 font-semibold">
        {msg.senderType}
      </p>

      <p>
        {msg.text}
      </p>

    </div>

  </div>

))

                
              )
          }

        </div>

        <input
          type="text"
          value={messageText}
          onChange={(e) =>
            setMessageText(e.target.value)
          }
          placeholder="Type a message..."
          className="w-full border p-2 rounded mb-3"
        />

        <div className="flex justify-end gap-2">

          <button
            onClick={() =>
              setShowChat(false)
            }
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Close
          </button>

         <button
    onClick={sendMessage}
    className="px-4 py-2 bg-primary text-white rounded"
>
    Send
</button>

        </div>

      </div>

    </div>

  )
}
        </div>
    )
}

export default MyAppointments
