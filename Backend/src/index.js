import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import { connectDB } from './lib/database.js'
import cookieParser from "cookie-parser"
import cors from "cors"
import { server, app } from "../src/lib/socket.js"

dotenv.config()

app.use(express.json())
app.use(cookieParser())

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    }));


app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

server.listen(process.env.PORT, () => {
    console.log("Server running on", process.env.PORT)
    connectDB()
})