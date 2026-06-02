import express from 'express'
import { analyzeSymptoms } from '../controllers/chatbotController.js'


const chatbotRouter = express.Router()

chatbotRouter.post('/analyze', analyzeSymptoms)

export default chatbotRouter