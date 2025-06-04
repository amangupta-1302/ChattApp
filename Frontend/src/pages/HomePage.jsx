import { useChatStore } from "../store/useChatStore.js";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatWindow from "../components/ChatWindow";

const Homepage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200 pt-16">
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-full">
          <div className="flex rounded-lg h-full overflow-hidden">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatWindow />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
