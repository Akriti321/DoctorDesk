import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import Appointment from './pages/Appointment'
import MyAppointments from './pages/MyAppointments'
import MyProfile from './pages/MyProfile'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify'
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword.jsx'

import { useState } from 'react'
import FloatingAIButton from './components/floatingbutton.jsx'
import ChatBot from './components/chatbot.jsx'

import RegisterDoctor from './pages/RegisterDoctor.jsx'

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const location = useLocation()

  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/verify' element={<Verify />} />
        <Route path="/forgot-password" element={<ForgotPassword />}/>
        <Route path="/reset-password" element={<ResetPassword />}/>
        <Route  path="/register-doctor"  element={<RegisterDoctor />}/>
      </Routes>
      <Footer />

{location.pathname !== '/login' && (
  <>
    <FloatingAIButton
      setIsChatOpen={setIsChatOpen}
    />

    {isChatOpen && (
      <ChatBot
        setIsChatOpen={setIsChatOpen}
      />
    )}
  </>
)}
    </div>
  )
}

export default App