import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { X, Image, Send } from "lucide-react";
import { toast } from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [sendImg, setSendImg] = useState(null);
  const { sendMessages } = useChatStore();
  const fileUploadRef = useRef(null);

  const handleImgUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSendImg(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImg = () => {
    setSendImg(null);
    if (fileUploadRef.current) fileUploadRef.current.value = null; // Reset the file input
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !sendImg) return;

    try {
      await sendMessages({ text: text.trim(), image: sendImg });
      // Reset input fields after sending
      setText("");
      setSendImg(null);
      if (fileUploadRef.current) fileUploadRef.current.value = null; // Reset the file input
    } catch (error) {
      toast.error("Failed to send message: ", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {sendImg && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={sendImg}
              alt="Preview"
              className="size-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImg}
              className="absolute -top-1.5 -right-1.5 rounded-full size-5 bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileUploadRef}
            className="hidden"
            onChange={handleImgUpload}
          />
          <button
            type="button"
            onClick={() => fileUploadRef.current?.click()}
            className={`hidden sm:flex btn btn-circle ${
              sendImg ? "text-emerald-500" : "text-zinc-500"
            }`}
          >
            <Image size={20} />
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-md btn-circle"
          disabled={!text.trim() && !sendImg}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
