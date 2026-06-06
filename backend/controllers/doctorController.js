import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import nodemailer from 'nodemailer'
import transporter from "../config/nodemailer.js";

// API for doctor Login 
const loginDoctor = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await doctorModel.findOne({ email })

        if (user && user.verificationStatus !== "approved") {
            return res.json({
                success: false,
                message: "Waiting for Admin Approval"
            })
        }

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {

        const docId = req.docId;
        const appointments = await appointmentModel.find({ docId });

        res.json({ success: true, appointments });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// // API to cancel appointment for doctor panel
// const appointmentCancel = async (req, res) => {
//     try {

//         const docId = req.docId;
//         const { appointmentId } = req.body;

//         const appointmentData = await appointmentModel.findById(appointmentId);

//         if (appointmentData && appointmentData.docId === docId) {
//             await appointmentModel.findByIdAndUpdate(
//                 appointmentId,
//                 { cancelled: true }
//             );

//             return res.json({
//                 success: true,
//                 message: 'Appointment Cancelled'
//             });
//         }

//         res.json({
//             success: false,
//             message: 'Appointment Cancelled'
//         });

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// }

const appointmentCancel = async (req, res) => {
    try {

        const docId = req.docId
        const { appointmentId } = req.body

        const appointmentData =
            await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {

            await appointmentModel.findByIdAndUpdate(
                appointmentId,
                { cancelled: true }
            )

            // Release booked slot
            const { slotDate, slotTime } = appointmentData

            const doctorData =
                await doctorModel.findById(docId)

            let slots_booked =
                doctorData.slots_booked

            slots_booked[slotDate] =
                slots_booked[slotDate].filter(
                    e => e !== slotTime
                )

            await doctorModel.findByIdAndUpdate(
                docId,
                { slots_booked }
            )

            return res.json({
                success: true,
                message: 'Appointment Cancelled'
            })
        }

        res.json({
            success: false,
            message: 'Unauthorized'
        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}
// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {

        const docId = req.docId;
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(
                appointmentId,
                { isCompleted: true }
            );

            return res.json({
                success: true,
                message: 'Appointment Completed'
            });
        }

        res.json({
            success: false,
            message: 'Appointment Cancelled'
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get all doctors list for Frontend
const doctorList = async (req, res) => {
    try {

        const doctors = await doctorModel.find({verificationStatus: "approved"}).select(['-password', '-email'])
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to change doctor availablity for Admin and Doctor Panel
const changeAvailablity = async (req, res) => {
    try {

        const docId  = req.docId;

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor profile for  Doctor Panel
const doctorProfile = async (req, res) => {
    try {

        const docId = req.docId;

        const profileData = await doctorModel
            .findById(docId)
            .select('-password');

        res.json({
            success: true,
            profileData
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}

// API to update doctor profile data from  Doctor Panel
const updateDoctorProfile = async (req, res) => {
    try {

        const docId = req.docId;
        const { fees, address, available } = req.body;

        await doctorModel.findByIdAndUpdate(docId, {
            fees,
            address,
            available
        });

        res.json({
            success: true,
            message: 'Profile Updated'
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {

        const  docId  = req.docId

        const appointments = await appointmentModel.find({ docId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })



        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for doctor self registration
const registerDoctor = async (req, res) => {
    try {

        const {
            name,
            email,
            password,
            speciality,
            degree,
            experience,
            about,
            fees,
            address,
            medicalLicenseNumber
        } = req.body

        const imageFile = req.files.image[0]
        const governmentIdFile = req.files.governmentId[0]
        const medicalCertificateFile = req.files.medicalCertificate[0]

        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Invalid Email"
            })
        }

        const doctorExists = await doctorModel.findOne({ email })

        if (doctorExists) {
            return res.json({
                success: false,
                message: "Doctor already exists"
            })
        }

        const salt = await bcrypt.genSalt(10)

        const hashedPassword =
            await bcrypt.hash(password, salt)

        const imageUpload =
            await cloudinary.uploader.upload(imageFile.path)

        const govUpload =
            await cloudinary.uploader.upload(governmentIdFile.path)

        const certificateUpload =
            await cloudinary.uploader.upload(
                medicalCertificateFile.path
            )

        const doctorData = {
            name,
            email,
            password: hashedPassword,

            image: imageUpload.secure_url,

            governmentIdUrl:
                govUpload.secure_url,

            medicalCertificateUrl:
                certificateUpload.secure_url,

            medicalLicenseNumber,

            speciality,
            degree,
            experience,
            about,
            fees,

            address: JSON.parse(address),

            date: Date.now(),

            verificationStatus: "pending"
        }

        await doctorModel.create(doctorData)

        res.json({
            success: true,
            message: "Application Submitted"
        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}
// API to add prescription
const addPrescription = async (req, res) => {
    try {
        const docId  = req.docId;
        const {
            appointmentId,
            medicines,
            notes
        } = req.body

        const appointmentData =
            await appointmentModel.findById(appointmentId)

        if (!appointmentData) {
            return res.json({
                success: false,
                message: "Appointment not found"
            })
        }
        if (appointmentData.docId.tostring() !== docId) {
            return res.json({
                success: false,
                message: "Unauthorized"
            })
        }

        await appointmentModel.findByIdAndUpdate(
            appointmentId,
            {
                prescription: {
                    medicines,
                    notes
                }
            }
        )

        res.json({
            success: true,
            message: "Prescription Saved"
        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}


// API to get prescription
const getPrescription = async (req, res) => {
    try {

        const { appointmentId } = req.params

        const appointment =
            await appointmentModel.findById(
                appointmentId
            )

        if (!appointment) {
            return res.json({
                success: false,
                message: "Appointment not found"
            })
        }

        res.json({
            success: true,
            prescription: appointment.prescription
        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

//API to update profile picture
const updateProfileImage = async (req, res) => {
    try {
        const doctorId = req.docId;
        const imageFile = req.file;

        const imageUpload = await cloudinary.uploader.upload(
            imageFile.path,
            { resource_type: "image" }
        );

        const imageUrl = imageUpload.secure_url;

        console.log("req.docId =", req.docId);

        await doctorModel.findByIdAndUpdate(doctorId, {
            image: imageUrl
        });

const doctor = await doctorModel.findById(doctorId);

if (!doctor) {
    return res.json({
        success: false,
        message: "Doctor not found"
    });
}

console.log("Updated image:", doctor.image);

        res.json({
            success: true,
            message: "Profile picture updated"
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};


//API for forgot password and send otp
const forgotPasswordDoctor = async (req, res) => {
  try {
    const { email } = req.body;

    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.json({
        success: false,
        message: "Doctor not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    doctor.resetOtp = otp;
    doctor.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;

    await doctor.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
    });

    res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
//API to reset password
const resetPasswordDoctor = async (req, res) => {
  try {

    const { email, otp, newPassword } = req.body

    const doctor = await doctorModel.findOne({ email })

    if (!doctor) {
      return res.json({
        success: false,
        message: 'Doctor not found'
      })
    }

    if (doctor.resetOtp !== otp) {
      return res.json({
        success: false,
        message: 'Invalid OTP'
      })
    }

    if (doctor.resetOtpExpireAt < Date.now()) {
      return res.json({
        success: false,
        message: 'OTP Expired'
      })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    doctor.password = hashedPassword
    doctor.resetOtp = ''
    doctor.resetOtpExpireAt = 0

    await doctor.save()

    res.json({
      success: true,
      message: 'Password reset successful'
    })

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    })
  }
}
export {
    registerDoctor,
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    doctorList,
    changeAvailablity,
    appointmentComplete,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
    addPrescription,
    getPrescription,
    updateProfileImage,
    forgotPasswordDoctor,
    resetPasswordDoctor
}