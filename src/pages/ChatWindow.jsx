import React, { useEffect, useState, useRef } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, doc, getDoc } from "firebase/firestore"; 
import { db } from "../firebase";
import "../styles/ChatPage.css";

const ChatWindow = ({ user, chat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatPartner, setChatPartner] = useState(null); 
  const messagesEndRef = useRef(null);

  const isStudent = user.role === "student";
  const mentorUid = chat?.mentorUid;
  const studentUid = chat?.studentUid;  
  const chatId = `${studentUid}_${mentorUid}`;

  useEffect(() => {
    const otherUid = isStudent ? mentorUid : studentUid;
    if (!otherUid) return;

    const fetchUser = async () => {
      const docRef = doc(db, "users", otherUid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setChatPartner(docSnap.data());
      }
    };

    fetchUser();
  }, [mentorUid, studentUid, isStudent]);

  useEffect(() => {
    if (!chatId) return;
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data());
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    await addDoc(messagesRef, {
      text: newMessage,
      senderUid: user.uid,
      timestamp: new Date(),
    });

    setNewMessage("");
  };
   
  return (
    <div id="chat-window">
      <h2 id="chat-title">
  {chatPartner
    ? `💬 Чат з ${chatPartner.lastName} ${chatPartner.firstName}`
    : "💬 Оберіть чат"}
</h2>

      <div id="chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.senderUid === user.uid ? "sent" : "received"}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div id="chat-input-area">
        <input
          id="chat-input"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Напишіть повідомлення..."
        />
        <button id="chat-send-button" onClick={sendMessage}>
          Надіслати
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
