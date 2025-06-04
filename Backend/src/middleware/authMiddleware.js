import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

export const validateToken = async (req, res, next) => {
    try {
        const token = req.cookies.JwtToken

        if (!token) return res.status(401).json({ message: "Unauthorized - No token available" })

        const decodedToken = jwt.verify(token, process.env.JWT_KEY)
        if (!decodedToken) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" })
        }
        const user = await User.findById(decodedToken.userId).select("-password") // select everything except password

        if (!user) return res.status(401).json({ message: "User not found" })

        req.user = user
        next()
    } catch (error) {
        console.log("Error in validatingToken middleware:  ", error.message)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}