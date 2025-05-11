import { collection, query, where, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export const getOrCreateChat = async (studentUid, mentorUid) => {
  const q = query(
    collection(db, "requests"),
    where("studentUid", "==", studentUid),
    where("mentorUid", "==", mentorUid),
    where("status", "==", "approved")
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const chatId = `${studentUid}_${mentorUid}`;
  const chatRef = doc(db, "chats", chatId);
  const existingChat = await getDoc(chatRef);

  if (!existingChat.exists()) {
    await setDoc(chatRef, {
      studentUid,
      mentorUid,
      participants: [studentUid, mentorUid], 
      createdAt: new Date()
    });
  }

  return chatId;
};
