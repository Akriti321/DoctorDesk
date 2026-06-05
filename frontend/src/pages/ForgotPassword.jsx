import React, { useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const ForgotPassword = () => {

  const { backendUrl } = useContext(AppContext)
  const navigate = useNavigate()

  const [email, setEmail] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/forgot-password',
        { email }
      )

      if (data.success) {
        toast.success('OTP sent successfully')

        navigate('/reset-password')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
  <div className="min-h-[80vh] flex items-center">
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 m-auto p-8 min-w-[340px] sm:min-w-96 border rounded-xl shadow-lg text-[#5E5E5E]"
    >
      <h2 className="text-2xl font-semibold text-center">
        Forgot Password
      </h2>

      <p className="text-sm text-center">
        Enter your registered email address to receive an OTP.
      </p>

      <div>
        <p>Email Address</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="border border-[#DADADA] rounded w-full p-2 mt-1"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-primary text-white py-2 rounded-md text-base"
      >
        Send OTP
      </button>
    </form>
  </div>
);
}

export default ForgotPassword