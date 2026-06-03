import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendAppointmentEmail = async (
  email,
  patientName,
  doctorName,
  slotDate,
  slotTime
) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Appointment Confirmed",

    html: `
      <h2>Appointment Confirmed ✅</h2>

      <p>Hello ${patientName},</p>

      <p>Your appointment has been booked successfully.</p>

      <p><b>Doctor:</b> ${doctorName}</p>
      <p><b>Date:</b> ${slotDate}</p>
      <p><b>Time:</b> ${slotTime}</p>

      <br/>

      <p>Thank you for choosing CareConnect.</p>
    `,
  });
};