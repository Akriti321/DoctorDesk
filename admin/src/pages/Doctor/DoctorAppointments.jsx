import React, { useState } from 'react'
import { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import axios from 'axios'
import {io} from 'socket.io-client'
const DoctorAppointments = () => {

  //const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const {
  dToken,
  appointments,
  getAppointments,
  cancelAppointment,
  completeAppointment,
  profileData,
  getProfileData,
  savePrescription,
  backendUrl
} = useContext(DoctorContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)
  const [showPrescription, setShowPrescription] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [medicines, setMedicines] = useState([
  {
    name: '',
    dosage: '',
    frequency: ''
  }
])
const [showChat, setShowChat] = useState(false)
const [socket, setSocket] = useState(null)

const [messages,
setMessages] = useState([])

const [messageText,
setMessageText] =
useState('')
const [notes, setNotes] = useState('')
const addMedicine = () => {

  setMedicines([
    ...medicines,
    {
      name: '',
      dosage: '',
      frequency: ''
    }
  ])

}
const loadMessages = async (appointmentId) => {

  try {

    console.log("Loading messages for:",
      appointmentId)

    const { data } = await axios.get(
      backendUrl + `/api/chat/${appointmentId}`
    )

    console.log(data)

    if (data.success) {
      setMessages(data.messages)
    }

  } catch (error) {
    console.log(error)
  }

}
const sendMessage = async () => {

  try {
    console.log("Doctor Send Clicked")
    console.log(selectedAppointment)
    console.log(profileData)
    const { data } = await axios.post(

      backendUrl + "/api/chat/send",

      {
        appointmentId:
          selectedAppointment._id,

        senderId:
          profileData._id,

        senderType:
          "doctor",

        text:
          messageText
      }

    )

    if (data.success) {
      socket.emit(
    "send_message",
    {
        senderType: "doctor",
        text: messageText
    }
)
      setMessageText("")

      loadMessages(
        selectedAppointment._id
      )

    }

  } catch (error) {

    console.log(error)

  }

}
    useEffect(() => {

  if (dToken) {

    getAppointments()

    getProfileData()

  }

}, [dToken])

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

  return (
    <div className='w-full max-w-6xl m-5 '>

      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-auto'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_1.5fr_1fr_2fr_1fr_1fr_2fr] gap-1 py-3 px-6 border-b'>
  <p>#</p>
  <p>Patient</p>
  <p>Payment</p>
  <p>Date & Time</p>
  <p>Fees</p>
  <p>Status</p>
  <p>Actions</p>
</div>
        {appointments.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_1.5fr_1fr_2fr_1fr_1fr_2fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
            <p className='max-sm:hidden'>{index}</p>
            <div className='flex items-center gap-2'>
              <img src={item.userData.image} className='w-8 rounded-full' alt="" /> <p>{item.userData.name}</p>
            </div>
            <div>
              <p className='text-xs inline border border-primary px-2 rounded-full'>
                {item.payment?'Online':'CASH'}
              </p>
            </div>
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            <p>{currency}{item.amount}</p>
            {item.cancelled
  ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
  : item.isCompleted
    ? <>
  <div>
    <span className='px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium'>
      Completed
    </span>
  </div>

  <div className='flex items-center gap-2'>

    <button
      onClick={async () => {
        setSelectedAppointment(item)
        setShowChat(true)
        await loadMessages(item._id)
      }}
      className='min-w-[70px] px-3 py-1 bg-primary text-white rounded text-xs'
    >
      Chat
    </button>

    <button
      onClick={() => {
        setSelectedAppointment(item)
        setShowPrescription(true)
      }}
      className='min-w-[90px] px-3 py-1 bg-primary text-white rounded text-xs'
    >
      Prescription
    </button>

  </div>
</>


                : <div className='flex items-center gap-2'>
  
 

  <img
    onClick={() => cancelAppointment(item._id)}
    className='w-10 cursor-pointer'
    src={assets.cancel_icon}
    alt=""
  />

  <img
    onClick={() => completeAppointment(item._id)}
    className='w-10 cursor-pointer'
    src={assets.tick_icon}
    alt=""
  />

</div>
            }
          </div>
        ))}
      </div>
        {
  showPrescription && (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white p-6 rounded-lg w-[500px]">

        <h2 className="text-lg font-semibold mb-4">
          Prescription
        </h2>

        {
  medicines.map((med, index) => (

    <div
      key={index}
      className="border rounded p-3 mb-3"
    >

      <p className="font-medium mb-2">
        Medicine {index + 1}
      </p>

      <input
        type="text"
        placeholder="Medicine Name"
        value={med.name}
        onChange={(e) => {

          const updated = [...medicines]

          updated[index].name =
            e.target.value

          setMedicines(updated)

        }}
        className="w-full border p-2 mb-2"
      />

      <input
        type="text"
        placeholder="Dosage"
        value={med.dosage}
        onChange={(e) => {

          const updated = [...medicines]

          updated[index].dosage =
            e.target.value

          setMedicines(updated)

        }}
        className="w-full border p-2 mb-2"
      />

      <input
        type="text"
        placeholder="Frequency"
        value={med.frequency}
        onChange={(e) => {

          const updated = [...medicines]

          updated[index].frequency =
            e.target.value

          setMedicines(updated)

        }}
        className="w-full border p-2"
      />

    </div>

  ))
}
<button
  onClick={addMedicine}
  className="mb-3 px-3 py-2 bg-primary text-white rounded"
>
  + Add Medicine
</button>
        <textarea
  placeholder="Notes"
  value={notes}
  onChange={(e) => setNotes(e.target.value)}
  className="w-full border p-2 mb-3"
/>

        <div className="flex justify-end gap-2">

          <button
            onClick={() => setShowPrescription(false)}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Close
          </button>

          <button
  onClick={async () => {

    

    await savePrescription(
      selectedAppointment._id,
      medicines,
      notes
    )

    setShowPrescription(false)

  }}
  className="px-4 py-2 bg-primary text-white rounded"
>
  Save
</button>

        </div>

      </div>

    </div>
  )
}
{
  showChat && (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white w-[600px] rounded-lg p-5">

        <h2 className="text-xl font-semibold mb-4">
          Patient Chat
        </h2>

        <div className="border h-[350px] overflow-y-auto p-3 mb-3 rounded">

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
                      msg.senderType === "doctor"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`max-w-[70%] px-3 py-2 rounded-lg ${
                        msg.senderType === "doctor"
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
          placeholder="Type a reply..."
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

export default DoctorAppointments