import React, { useContext, useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import "../styles/ChatPage.css";

const ChatPage = () => {
  const { mentorUid, studentUid } = useParams();
  const { user } = useContext(UserContext);
  const [selectedChat, setSelectedChat] = useState(
    mentorUid && studentUid ? { mentorUid, studentUid } : null
  );

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <div id="chat-page">
      <ChatSidebar user={user} onSelectChat={handleChatSelect} />
      <ChatWindow user={user} chat={selectedChat} />
    </div>
  );
};

export default ChatPage;
