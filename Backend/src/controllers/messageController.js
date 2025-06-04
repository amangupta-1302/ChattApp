import Message from "../models/messageModel.js"
import User from "../models/userModel.js"
import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js"


export const usersforSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id

        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")
        if (!filteredUsers) return res.status(401).json({ message: "No users found" })

        return res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("Error in usersforSidebar controller :", error.message)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: usertoChatId } = req.params
        const myId = req.user._id
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: usertoChatId }, { senderId: usertoChatId, receiverId: myId }
            ]
        })
        return res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages controller :", error.message)
        return res.status(500).json({ message: "Internal Server Error" })

    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body
        const { id: receiverId } = req.params
        const myId = req.user._id
        let imageUrl
        if (image) {
            const uploadUrl = await cloudinary.uploader.upload(image)
            imageUrl = uploadUrl.secure_url
        }

        const newMessage = new Message({
            senderId: myId,
            receiverId,
            text, image: imageUrl
        })
        await newMessage.save()

        const receiverSocketId = getReceiverSocketId(receiverId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessages", newMessage)
        }
        return res.status(201).json(newMessage)

    } catch (error) {
        console.log("Error in sendMessage controller :", error.message)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

