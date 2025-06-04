import bcrypt from "bcryptjs";
import User from "../models/userModel.js"
import { generateToken } from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) => {
    const { fullname, email, password } = req.body
    try {
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (password.length < 5) {
            return res.status(400).json({ message: "Password must be atleast 5 characters" })
        }
        const user = await User.findOne({ email })
        if (user) return res.status(400).json({ message: "Email already exists!" })

        // Password hashing 
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            email, fullname, password: hashedPassword
        })

        if (newUser) {
            // jwt token generate
            generateToken(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                message: "Account Created successfully",
                id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        } else {
            res.status(400).json({ message: "Invalid user data" })
        }

    } catch (error) {
        console.log("Error in signup controller : ", error.message)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const login = async (req, res) => {

    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: "Invalid Credentials" })

        if (await bcrypt.compare(password, user.password)) {
            generateToken(user._id, res)
            return res.status(200).json({
                message: "Logged in successfully",
                fullname: user.fullname,
                email: user.email,
                profilePic: user.profilePic
            })
        }
        else {
            return res.status(400).json({ message: "Invalid Credentials" })
        }
    } catch (error) {
        console.log("Error in login controller : ", error.message)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("JwtToken", "", {
            maxAge: 0
        })
        return res.status(200).json({ message: "Logged Out successfully" })
    } catch (error) {
        console.log("Error in logout controller :", error.message)
        return res.status(500).json({ message: "Internal Server Error" })
    }

}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body
        const userId = req.user._id

        if (!profilePic) return res.status(401).json({ message: "Profile pic is required" })

        const uploadURL = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: uploadURL.secure_url
        }, { new: true }
        )
        return res.status(200).json(updatedUser)
    } catch (error) {
        console.log("Error in updating profilePic :", error.message)
        return res.status(500).json({ message: "Internal Server Error" })
    }


}


export const checkCurrentUser = (req, res) => {
    try {
        return res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in check current User auth :", error.message)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}