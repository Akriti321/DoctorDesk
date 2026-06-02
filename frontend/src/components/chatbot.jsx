
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { doctors } from '../assets/assets'
import React, { useState, useContext ,useRef, useEffect} from 'react'
import { AppContext } from '../context/AppContext'


const ChatBot = ({ setIsChatOpen }) => {

    const navigate = useNavigate()

    const { userData } = useContext(AppContext)
    

    const calculateAge = (dob) => {

    const birthDate = new Date(dob)
    const today = new Date()

    let age = today.getFullYear() - birthDate.getFullYear()

    const monthDiff =
        today.getMonth() - birthDate.getMonth()

    if (
        monthDiff < 0 ||
        (
            monthDiff === 0 &&
            today.getDate() < birthDate.getDate()
        )
    ) {
        age--
    }

    return age
}

    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [awaitingPatientType, setAwaitingPatientType] = useState(false)
    const [patientType, setPatientType] = useState('')
    const [step, setStep] = useState('symptoms')
    const [symptoms, setSymptoms] = useState('')
    const [patientDetails, setPatientDetails] = useState('')
    const messagesEndRef = useRef(null)



    const [messages, setMessages] = useState([
        {
            sender: 'bot',
            text: 'Hello! 👋 Tell me your symptoms and I will recommend the right specialist.'
        }
    ])
    
    useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth'
    })

}, [messages, loading])
    
    const sendMessage = async () => {

        if (!input.trim()) return

        if (step === 'symptoms') {

    const userMessage = {
        sender: 'user',
        text: input
    }

    setMessages(prev => [...prev, userMessage])

    setSymptoms(input)

    setMessages(prev => [
        ...prev,
        {
            sender: 'bot',
            text: `Who is experiencing these symptoms?

1. Me
2. My Child
3. My Parent
4. Someone Else`
        }
    ])

    setStep('patientType')
    setInput('')
    return
}

if (step === 'patientType') {

    const userMessage = {
        sender: 'user',
        text: input
    }

    setMessages(prev => [...prev, userMessage])

    setPatientType(input)

if (input.toLowerCase() === 'me') {

    const age = userData ? calculateAge(userData.dob) : ''

    setMessages(prev => [
        ...prev,
        {
            sender: 'bot',
            text: `I can see you're a ${age}-year-old ${userData?.gender?.toLowerCase() || ''}.

How severe are the symptoms?

1. Mild
2. Moderate
3. Severe`
        }
    ])

}else {

        setMessages(prev => [
            ...prev,
            {
                sender: 'bot',
                text: `Please provide:

👤 Age
⚧  Gender
🚨 Severity`
            }
        ])
    }

    setStep('details')
    setInput('')
    return
}

        const userMessage = {
            sender: 'user',
            text: input
        }

        setMessages(prev => [...prev, userMessage])

        setInput('')



        setLoading(true)

try {
let symptomPayload = ''

if (patientType.trim().toLowerCase() === 'me') {

    const age = userData
        ? calculateAge(userData.dob)
        : ''

    symptomPayload = `
Symptoms: ${symptoms}

Patient Type: Me

Age: ${age}
Gender: ${userData?.gender || ''}

Severity: ${input}
`
}
else {

    symptomPayload = `
Symptoms: ${symptoms}

Patient Type: ${patientType}

Patient Details:
${input}
`
}

const { data } = await axios.post(
    'http://localhost:4000/api/chatbot/analyze',
    {
        symptoms: symptomPayload
    }
)

    if (data.success) {

const doctorCount = doctors.filter(
    doc => doc.speciality === data.speciality
).length

const botReply = {
    sender: 'bot',
    speciality: data.speciality,
    reason: data.reason,
    disclaimer: data.disclaimer,
    doctorCount
}

        setMessages(prev => [...prev, botReply])
        setLoading(false)

    }

}
catch (error) {

    console.log(error)
    setLoading(false)

}

    }

    return (
<div className='fixed right-6 top-24 bottom-6 w-[500px] bg-white rounded-2xl shadow-2xl border border-primary z-50 flex flex-col overflow-hidden'>

            {/* Header */}

            <div className='bg-white text-primary p-4 flex justify-between items-center border-b border-primary'>
                <h2 className='font-semibold'>
                    AI Health Assistant
                </h2>

                <button onClick={() => setIsChatOpen(false)}
                    className='text-primary text-xl font-bold'>
                    ✕
                </button>
            </div>

            {/* Messages */}

            <div className='flex-1 overflow-y-auto p-4 flex flex-col gap-2 '>

                {messages.map((msg, index) => (

                    <div
    key={index}
    className={`p-3 rounded-lg max-w-[80%] whitespace-pre-line

    ${msg.sender === 'user'
            ? 'bg-gray-200 self-end text-black'
            : 'bg-primary self-start text-white'
        }`}
>

    {msg.sender === 'user' ? (

        msg.text

    ) : msg.speciality ? (

        <>
            <p className='font-semibold'>
                🩺 Recommended Specialist
            </p>

            <p className='mt-2 font-medium text-lg'>
    {msg.speciality}
</p>

<p className='mt-2'>
    👨‍⚕️ {msg.doctorCount} doctor{msg.doctorCount !== 1 ? 's' : ''} available for consultation
</p>

<p className='mt-1 text-sm opacity-90'>
    Click below to view available doctors and book an appointment.
</p>

<button
    onClick={() => navigate(`/doctors/${msg.speciality}`)}
    className='bg-white text-primary px-3 py-2 rounded-lg mt-3 font-medium'
>
    View Available Doctors
</button>
            <p className='mt-4 font-semibold'>
                📋 Reason
            </p>

            <p>
                {msg.reason}
            </p>

            <p className='mt-4 font-semibold'>
                ⚠ Disclaimer
            </p>

            <p>
                {msg.disclaimer}
            </p>
        </>

    ) : (

        msg.text

    )}

</div>

                ))}
            <div ref={messagesEndRef}></div>

            </div>
            {loading && (

        <div className='bg-primary text-white p-3 rounded-lg w-fit animate-pulse'>

            🩺 Analyzing symptoms...

        </div>

    )}

            {/* Input */}

            <div className='p-3 border-t flex gap-2'>

                <input
                    type='text'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                        sendMessage()
                            }
                        }}
                    placeholder='Describe your symptoms...'
                    className='flex-1 border rounded-lg px-3 py-2 outline-none'
                />

                <button
                    onClick={sendMessage}
                    className='bg-primary text-white px-4 rounded-lg'
                >
                    Send
                </button>

            </div>

        </div>
    )
}

export default ChatBot