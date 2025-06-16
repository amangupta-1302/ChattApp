import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import { connectDB } from './lib/database.js'
import cookieParser from "cookie-parser"
import cors from "cors"
import { server, app } from "../src/lib/socket.js"
import path from "path"
dotenv.config()

app.use(express.json())
app.use(cookieParser())

const __dirname = path.resolve()

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    }));

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

app.use(express.static(path.join(__dirname, "../Frontend/dist")))


app.get(/(.*)/, (_, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"))
})
server.listen(process.env.PORT, () => {
    console.log("Server running on", process.env.PORT)
    connectDB()
})