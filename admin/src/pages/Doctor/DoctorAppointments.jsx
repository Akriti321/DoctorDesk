import React, { useState } from 'react'
import { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorAppointments = () => {

  //const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const {
  dToken,
  appointments,
  getAppointments,
  cancelAppointment,
  completeAppointment,
  savePrescription
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
    useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  return (
    <div className='w-full max-w-6xl m-5 '>

      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-auto'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_1.5fr_1fr_2fr_1fr_2fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p className='text-red-500 font-bold'>Action</p>
        </div>
        {appointments.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_1.5fr_1fr_2fr_1fr_2fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
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
  ? <div className='flex items-center gap-2'>
      <p className='text-green-500 text-xs font-medium'>
        Completed
      </p>

      <button
        onClick={() => {
          setSelectedAppointment(item)
          setShowPrescription(true)
        }}
       className='px-2 py-1 bg-[#49BF94] hover:bg-[#3da97f] text-white rounded text-xs'
      >
        Prescription
      </button>
    </div>
                : <div className='flex items-center gap-2'>
  
  <button
  onClick={() => {
    setSelectedAppointment(item)
    setShowPrescription(true)
  }}
  className='px-2 py-1 bg-[#49BF94] text-white rounded text-xs'
>
  Prescription
</button>

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
  className="mb-3 px-3 py-2 bg-green-500 text-white rounded"
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
  className="px-4 py-2 bg-green-500 text-white rounded"
>
  Save
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