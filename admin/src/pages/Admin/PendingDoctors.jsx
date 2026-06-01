import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const PendingDoctors = () => {

    const [doctors, setDoctors] = useState([])

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const fetchPendingDoctors = async () => {
    try {

        const aToken = localStorage.getItem('aToken')

        const { data } = await axios.get(
            `${backendUrl}/api/admin/pending-doctors`,
            {
                headers: { aToken }
            }
        )

        if (data.success) {
            setDoctors(data.doctors)
        } else {
            toast.error(data.message)
        }

    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }
}

    const approveDoctor = async (doctorId) => {
        try {

            const aToken = localStorage.getItem('aToken')

            const { data } = await axios.post(
                `${backendUrl}/api/admin/approve-doctor`,
                { doctorId },
                {
                    headers: { aToken }
                }
            )

            if (data.success) {
                toast.success(data.message)
                fetchPendingDoctors()
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const rejectDoctor = async (doctorId) => {
        try {

            const aToken = localStorage.getItem('aToken')

            const { data } = await axios.post(
                `${backendUrl}/api/admin/reject-doctor`,
                {
                    doctorId,
                    rejectionReason: 'Rejected by admin'
                },
                {
                    headers: { aToken }
                }
            )

            if (data.success) {
                toast.success(data.message)
                fetchPendingDoctors()
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchPendingDoctors()
    }, [])

    return (
        <div className='w-full m-5'>

            <h1 className='text-2xl font-semibold mb-5'>
                Pending Doctor Requests
            </h1>

            {doctors.length === 0 ? (
                <p>No pending doctor requests.</p>
            ) : (
                doctors.map((doctor) => (
                    <div
    key={doctor._id}
    className="bg-white border rounded-lg p-5 mb-5 shadow"
  >
    <div className="flex gap-5">

      {/* Doctor Photo */}
      <img
        src={doctor.image}
        alt=""
        className="w-32 h-32 rounded object-cover border"
      />

      <div className="flex-1">

        <h2 className="text-xl font-bold">
          {doctor.name}
        </h2>

        <p><b>Email:</b> {doctor.email}</p>

        <p><b>Speciality:</b> {doctor.speciality}</p>

        <p><b>Degree:</b> {doctor.degree}</p>

        <p><b>Experience:</b> {doctor.experience}</p>

        <p><b>Fees:</b> ₹{doctor.fees}</p>

        <p>
          <b>Medical License:</b>
          {doctor.medicalLicenseNumber}
        </p>

        <p>
          <b>Address:</b>
          {doctor.address?.line1}
          {" "}
          {doctor.address?.line2}
        </p>

        <p className="mt-2">
          <b>About:</b>
          {doctor.about}
        </p>

      </div>
    </div>

    {/* Documents */}
    <div className="mt-5">

      <h3 className="font-semibold text-lg mb-3">
        Uploaded Documents
      </h3>

      <div className="flex gap-4">

        <a
          href={doctor.governmentIdUrl}
          target="_blank"
          rel="noreferrer"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          View Government ID
        </a>

        <a
          href={doctor.medicalCertificateUrl}
          target="_blank"
          rel="noreferrer"
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          View Certificate
        </a>

      </div>
    </div>

    {/* Approve Reject */}
    <div className="flex gap-3 mt-5">

      <button
        onClick={() => approveDoctor(doctor._id)}
        className="bg-green-500 text-white px-5 py-2 rounded"
      >
        Approve
      </button>

      <button
        onClick={() => rejectDoctor(doctor._id)}
        className="bg-red-500 text-white px-5 py-2 rounded"
      >
        Reject
      </button>

    </div>

  </div>
                ))
            )}

        </div>
    )
}

export default PendingDoctors