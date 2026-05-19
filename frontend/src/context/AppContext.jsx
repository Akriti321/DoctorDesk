import { createContext, useState } from "react";
import { doctors, assets } from "../assets/assets";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const [userData, setUserData] = useState({
        name: 'Edward Vincent',
        image: assets.profile_pic,
        email: 'edward@gmail.com',
        phone: '+1 123 456 789',
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Church Road, London'
        },
        gender: 'Male',
        dob: '2000-01-20'
    })

    const token = true
    const backendUrl = 'http://localhost:4000'

    const loadUserProfileData = async () => {

    }

    const value = {
        doctors,
        userData,
        setUserData,
        token,
        backendUrl,
        loadUserProfileData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider