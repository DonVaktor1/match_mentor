import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const ChatSidebar = ({ user, onSelectChat }) => {
  const [chatUsers, setChatUsers] = useState([]);

  useEffect(() => {
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where("participants", "array-contains", user.uid));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatsData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const otherUid = data.participants.find((uid) => uid !== user.uid);
          const userDoc = await getDoc(doc(db, "users", otherUid));
          if (!userDoc.exists()) return null;

          return {
            chatId: docSnap.id,
            otherUid,
            ...userDoc.data(),
          };
        })
      );

      setChatUsers(chatsData.filter(Boolean));
    });
    
    return () => unsubscribe();
  }, [user.uid]);

  return (
    <div id="chat-sidebar">
      {chatUsers.map((chatUser) => (
        <div
          key={chatUser.chatId}
          className="chat-sidebar-item"
          onClick={() =>
            onSelectChat({
              studentUid: user.role === "student" ? user.uid : chatUser.otherUid,
              mentorUid: user.role === "mentor" ? user.uid : chatUser.otherUid,
            })
          }
        >
          <img src={chatUser.avatarUrl} alt="avatar" className="avatar" />
          <span>{chatUser.lastName}</span>
          <span>{chatUser.firstName}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatSidebar;
