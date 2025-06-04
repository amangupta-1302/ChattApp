import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});


const usersSocket = {};

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    const userId = socket.handshake.query.userId
    if (userId && userId !== "undefined") { usersSocket[userId] = socket.id }
    io.emit("getOnlineUsers", Object.keys(usersSocket))

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        if (userId && userId !== "undefined") {
            delete usersSocket[userId]
        }

        io.emit("getOnlineUsers", Object.keys(usersSocket))
    })
})

export function getReceiverSocketId(userId) {
    return usersSocket[userId]
}

export { io, app, server }