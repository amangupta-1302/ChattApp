import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageContainer from "./MessageContainer.jsx";

const ChatWindow = () => {
  const {
    getMessages,
    isMessagesLoading,
    selectedUser,
    getNewMessages,
    offlineMessage,
  } = useChatStore();

  useEffect(() => {
    getMessages(selectedUser._id);
    getNewMessages();

    return () => offlineMessage();
  }, [selectedUser._id, getMessages, getNewMessages, offlineMessage]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader />
      <MessageContainer />
      <MessageInput />
    </div>
  );
};

export default ChatWindow;
