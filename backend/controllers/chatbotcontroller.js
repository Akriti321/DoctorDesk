import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeSymptoms = async (req, res) => {

    try {

        const { symptoms } = req.body;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

const prompt = `
You are an AI healthcare assistant.

Choose ONLY ONE value from the list below, best suited to the symptoms provided by the user. Do not provide any explanation.

Available Specialists:
- General physician
- Gynaecologist
- Dermatologist
- Pediatrician
- Neurologist
- Gastroenterologist
-Cardiologist
- Orthopedist


Return ONLY valid JSON.

{
  "speciality":"",
  "reason":"",
  "disclaimer":"This is not a medical diagnosis. Please consult a healthcare professional."
}

User Symptoms:
${symptoms}
`;

        const result = await model.generateContent(prompt);

const reply = result.response.text();

const cleanedReply = reply
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

    console.log("RAW GEMINI RESPONSE:");
console.log(reply);

console.log("CLEANED RESPONSE:");
console.log(cleanedReply);

const parsedReply = JSON.parse(cleanedReply);

res.json({
    success: true,
    speciality: parsedReply.speciality,
    reason: parsedReply.reason,
    disclaimer: parsedReply.disclaimer
});

    }

    catch (error) {

    console.log(error);

    res.json({
        success: true,
        speciality: "General physician",
        reason: "AI service is currently unavailable, so a fallback recommendation has been provided.",
        disclaimer: "This is not a medical diagnosis. Please consult a healthcare professional."
    });

}

}

export { analyzeSymptoms }