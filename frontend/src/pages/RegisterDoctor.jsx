import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const RegisterDoctor = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        speciality: '',
        degree: '',
        experience: '',
        fees: '',
        address: '',
        about: '',
        medicalLicenseNumber: ''
    })

    const [image, setImage] = useState(null)
    const [governmentId, setGovernmentId] = useState(null)
    const [medicalCertificate, setMedicalCertificate] = useState(null)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        try {

            const dataToSend = new FormData()

            dataToSend.append('name', formData.name)
            dataToSend.append('email', formData.email)
            dataToSend.append('password', formData.password)
            dataToSend.append('speciality', formData.speciality)
            dataToSend.append('degree', formData.degree)
            dataToSend.append('experience', formData.experience)
            dataToSend.append('fees', formData.fees)
            dataToSend.append('about', formData.about)

            dataToSend.append(
                'address',
                JSON.stringify({
                    line1: formData.address
                })
            )

            dataToSend.append(
                'medicalLicenseNumber',
                formData.medicalLicenseNumber
            )

            dataToSend.append('image', image)
            dataToSend.append('governmentId', governmentId)
            dataToSend.append(
                'medicalCertificate',
                medicalCertificate
            )

            const { data } = await axios.post(
                'http://localhost:4000/api/doctor/register',
                dataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )

            if (data.success) {
                toast.success(data.message)

                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    speciality: '',
                    degree: '',
                    experience: '',
                    fees: '',
                    address: '',
                    about: '',
                    medicalLicenseNumber: ''
                })

                setImage(null)
                setGovernmentId(null)
                setMedicalCertificate(null)

            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    return (
        <form
            onSubmit={onSubmitHandler}
            className='max-w-3xl mx-auto p-6'
        >

            <h1 className='text-3xl font-bold mb-6'>
                Doctor Registration
            </h1>

            <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="Name"
                onChange={handleChange}
                className='border p-2 w-full mb-3 rounded'
                required
            />

            <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="Email"
                onChange={handleChange}
                className='border p-2 w-full mb-3 rounded'
                required
            />

            <input
                type="password"
                name="password"
                value={formData.password}
                placeholder="Password"
                onChange={handleChange}
                className='border p-2 w-full mb-3 rounded'
                required
            />

            <select
    name="speciality"
    value={formData.speciality}
    onChange={handleChange}
    className="border p-2 w-full mb-3 rounded"
    required
>
    <option value="">Select Speciality</option>
    <option value="General physician">General physician</option>
    <option value="Gynaecologist">Gynaecologist</option>
    <option value="Dermatologist">Dermatologist</option>
    <option value="Pediatrician">Pediatrician</option>
    <option value="Neurologist">Neurologist</option>
    <option value="Gastroenterologist">Gastroenterologist</option>
    <option value="Cardiologist">Cardiologist</option>
    <option value="Orthopaedist">Orthopaedist</option>
</select>

            <input
                type="text"
                name="degree"
                value={formData.degree}
                placeholder="Degree"
                onChange={handleChange}
                className='border p-2 w-full mb-3 rounded'
                required
            />

            <input
                type="text"
                name="experience"
                value={formData.experience}
                placeholder="Experience"
                onChange={handleChange}
                className='border p-2 w-full mb-3 rounded'
                required
            />

            <input
                type="number"
                name="fees"
                value={formData.fees}
                placeholder="Consultation Fees"
                onChange={handleChange}
                className='border p-2 w-full mb-3 rounded'
                required
            />

            <input
                type="text"
                name="medicalLicenseNumber"
                value={formData.medicalLicenseNumber}
                placeholder="Medical License Number"
                onChange={handleChange}
                className='border p-2 w-full mb-3 rounded'
                required
            />

            <textarea
                name="about"
                value={formData.about}
                placeholder="About Yourself"
                onChange={handleChange}
                className='border p-2 w-full mb-3 rounded'
                rows="4"
                required
            />

            <textarea
                name="address"
                value={formData.address}
                placeholder="Address"
                onChange={handleChange}
                className='border p-2 w-full mb-5 rounded'
                rows="3"
                required
            />

            <div className='mb-4'>
                <p className='font-medium mb-2'>Profile Image</p>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    required
                />
            </div>

            <div className='mb-4'>
                <p className='font-medium mb-2'>Government ID</p>
                <input
                    type="file"
                    onChange={(e) => setGovernmentId(e.target.files[0])}
                    required
                />
            </div>

            <div className='mb-6'>
                <p className='font-medium mb-2'>Medical Certificate</p>
                <input
                    type="file"
                    onChange={(e) => setMedicalCertificate(e.target.files[0])}
                    required
                />
            </div>

            <button type="submit"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:scale-105 active:scale-95 hover:shadow-lg transition-all duration-300">
                Apply For Verification
            </button>
        </form>
    )
}

export default RegisterDoctor
