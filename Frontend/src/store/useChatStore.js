import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '../lib/axios.js';
import { useAuthStore } from "./useAuthStore.js"

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    isUsersLoading: false,
    isMessagesLoading: false,
    selectedUser: null,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance('/message/user');
            set({ users: res.data })
        } catch (error) {
            toast.error('Failed to fetch users');
            console.log("Error in getUsers chat store :", error.response.data.message)
        }
        finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance(`/message/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error('Failed to fetch messages');
            console.log("Error in getMessages chat store :", error.response.data.message);
        }
        finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessages: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });

        } catch (error) {
            toast.error('Failed to send message');
            console.log("Error in sendMessages chat store :", error.response.data.message);
        }
    },

    setSelectedUser: (selectedUser) => {
        set({ selectedUser });
    },

    getNewMessages: () => {
        const { selectedUser } = get()

        if (!selectedUser) return;
        const socket = useAuthStore.getState().socket
        //todo: opt
        socket.on("newMessages", (newMessage) => {
            if (newMessage.senderId !== selectedUser._id) return

            set({ messages: [...get().messages, newMessage] })
        })
    },

    offlineMessage: () => {
        const socket = useAuthStore.getState().socket
        socket.off("newMessages")
    },
}))