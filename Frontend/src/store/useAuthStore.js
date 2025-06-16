import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"
import { io } from "socket.io-client"

const BASE_URL = import.meta.env.MODE === "development" ? 'http://localhost:3001/' : "/"

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [], // to store online users
    socket: null, // to store socket instance

    checkAuth: async () => { // to check authenticated user while page refreshes 
        try {
            const response = await axiosInstance.get("/auth/check")
            set({ authUser: response.data })
            get().connectToSocket() // connect to socket if user is authenticated

        } catch (error) {
            console.log("Error in CheckAuth store", error.message)
            set({ authUser: null })
        }
        finally {
            set({ isCheckingAuth: false })
        }
    },

    signUp: async (formData) => {
        set({ isSigningUp: true })
        try {
            const response = await axiosInstance.post("/auth/signup", formData)
            set({ authUser: response.data })
            toast.success("Account created successfully!")
            // get().connectToSocket() // connect to socket after successful signup
            window.location.reload()

        } catch (error) {
            if (formData.email && formData.password) {
                toast.error(
                    error.response.data.message)
            }
            console.log("Error in SignUp store", error.message)
        } finally {
            set({ isSigningUp: false })
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout")
            set({ authUser: null })
            toast.success("Logged out successfully!")
            get().disconnectFromSocket() // disconnect socket on logout
        } catch (error) {
            console.log("Error in Logout store", error.message)
            toast.error("Failed to log out")
        }
    },

    login: async (formData) => {
        set({ isLoggingIn: true })
        try {
            const response = await axiosInstance.post("/auth/login", formData)
            set({ authUser: response.data })
            toast.success("Logged in successfully!")
            // get().connectToSocket() // connect socket on login
            window.location.reload()

        } catch (error) {
            if (formData.email && formData.password) {
                toast.error(
                    error.response.data.message)
            }
            console.log("Error in Login store", error.message)
        }

        finally {
            set({ isLoggingIn: false })
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const response = await axiosInstance.put("/auth/updateprofile", data)
            set({ authUser: response.data })
            toast.success("Profile updated successfully!")
        } catch (error) {
            toast.error(
                error.response.data.message)
            console.log("Error in UpdateProfile store", error.message)
        } finally {
            set({ isUpdatingProfile: false })

        }
    },

    connectToSocket: () => {
        const { authUser } = get()
        if (get().socket) {
            get().socket.disconnect() // disconnect previous sockets if exists
        }

        if (!authUser) {
            return;
        }
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            }
        })
        set({ socket: socket })

        socket.off("getOnlineUsers")
        socket.on("getOnlineUsers", (userIds) => {

            set({ onlineUsers: userIds }) // map the user(online)  to online user array 
        })
    },

    disconnectFromSocket: () => {
        if (get().socket?.connected) {
            get().socket.disconnect();
            set({ socket: null, onlineUsers: [] })
        }
    },
}))
