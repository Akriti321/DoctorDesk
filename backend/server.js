import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"
import prescriptionRouter from "./routes/prescriptionRoute.js";
import chatRouter from "./routes/chatRoute.js";
import { createServer } from "http"
import { Server } from "socket.io"
import chatbotRouter from "./routes/chatbotroute.js"

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()
const server = createServer(app)

const io = new Server(server,{
  cors:{ origin:"*" }
})
io.on("connection", (socket) => {

  console.log(
    "User Connected:",
    socket.id
  )

  socket.on(
    "send_message",
    (data) => {

      socket.broadcast.emit(
        "receive_message",
        data
      )

    }
  )

  socket.on(
    "disconnect",
    () => {

      console.log(
        "User Disconnected:",
        socket.id
      )

    }
  )

})
// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)
app.use('/api/chat', chatRouter)
app.use("/api/chatbot", chatbotRouter)
app.use("/api/prescription",prescriptionRouter);

app.get("/", (req, res) => {
  res.send("API Working")
});

server.listen(port, () =>
  console.log(
    `Server started with Socket.IO on PORT:${port}`
  )
)