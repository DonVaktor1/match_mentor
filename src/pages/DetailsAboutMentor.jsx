import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { UserContext } from "../UserContext";
import { query, where, getDocs } from "firebase/firestore";

const DetailsAboutMentor = () => {
  const location = useLocation();
  const mentor = location.state?.mentor;
  const { user } = useContext(UserContext);
  const [isRequested, setIsRequested] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkIfRequested = async () => {
      if (!user || !mentor) {
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "requests"),
        where("mentorUid", "==", mentor.uid),
        where("studentUid", "==", user.uid),
        where("status", "in", ["pending", "approved"])
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setIsRequested(true);
      }

      setLoading(false);
    };

    checkIfRequested();
  }, [user, mentor]);

  if (loading) return null;

  if (!mentor) {
    return <p>Ментор не знайдений</p>;
  }

  const sendRequest = async () => {
    if (!user) {
      console.error("❌ Користувач не авторизований!");
      return;
    }

    try {
      await addDoc(collection(db, "requests"), {
        mentorUid: mentor.uid,
        mentorName: `${mentor.lastName} ${mentor.firstName}`,
        studentUid: user.uid,
        studentName: `${user.lastName} ${user.firstName}`,
        status: "pending",
        timestamp: new Date(),
      });

      setIsRequested(true);
    } catch (error) {
      console.error("Помилка при надсиланні заявки:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>{mentor.lastName} {mentor.firstName}</h1>
      <p><b>Вік:</b> {mentor.birthDate}</p>
      <p><b>Стаж роботи:</b> {mentor.experience || "Не вказано"}</p>
      <p><b>Рейтинг:</b> {mentor.rating || "5.0"}</p>

      {!isRequested ? (
        <button
          onClick={sendRequest}
          disabled={loading}
          style={{
            padding: "10px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          Подати заявку
        </button>
      ) : (
        <p style={{ color: "green" }}>Заявка вже надіслана!</p>
      )}
    </div>
  );
};

export default DetailsAboutMentor;
