import React from 'react'

const FloatingAIButton = ({ setIsChatOpen }) => {
    return (
        <button
            onClick={() => setIsChatOpen(true)}
            className='fixed top-6 right-6 bg-primary text-white px-5 py-3 rounded-full shadow-lg hover:scale-105 transition-all z-50'
        >
            🩺 Ask AI
        </button>
    )
}

export default FloatingAIButton