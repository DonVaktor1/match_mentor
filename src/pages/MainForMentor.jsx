import React, { useContext, useState, useEffect, useCallback } from "react";
import { UserContext } from "../UserContext";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { collection, getDocs, updateDoc, doc, query, where, getDoc } from "firebase/firestore";
import StudentCard from "../components/StudentCard";
import "../styles/MainForMentor.css";

function MainForMentor() {
  useAuth(["mentor"]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  const fetchRequests = useCallback(async () => {
    if (!user?.uid) return;

    try {
      const q = query(collection(db, "requests"), where("mentorUid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const mentorRequests = await Promise.all(
        querySnapshot.docs.map(async (requestDoc) => {
          const requestData = requestDoc.data();
          if (requestData.status !== "pending") return null;

          let studentData = null;
          if (requestData.studentUid) {
            const studentRef = doc(db, "users", requestData.studentUid);
            const studentSnap = await getDoc(studentRef);
            if (studentSnap.exists()) {
              studentData = studentSnap.data();
            }
          }

          return {
            id: requestDoc.id,
            ...requestData,
            studentData,
          };
        })
      );

      setRequests(mentorRequests.filter(Boolean));
    } catch (error) {
      console.error("🔴 Помилка отримання заявок:", error);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const updateRequestStatus = async (id, status) => {
    try {
      const requestRef = doc(db, "requests", id);
      await updateDoc(requestRef, { status });

      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Помилка при оновленні статусу заявки:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="container">
      <h1>👨‍🏫 Вітаємо, {user?.firstName}!</h1>
      <p>Тут ти можеш переглянути нові заявки на менторство.</p>

      <h2>🕓 Нові заявки:</h2>
      <div className="requestsContainer">
        {requests.length > 0 ? (
          requests.map((request) => (
            <div key={request.id} className="cardWrapper">
              {request.studentData ? (
                <StudentCard
                  student={request.studentData}
                  status={request.status}
                  onApprove={() => updateRequestStatus(request.id, "approved")}
                  onReject={() => updateRequestStatus(request.id, "rejected")}
                />
              ) : (
                <div className="card">
                  <p className="error">⚠️ Дані про учня відсутні</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Нових заявок немає</p>
        )}
      </div>

      <button className="logoutButton" onClick={handleLogout}>
        Вийти
      </button>
    </div>
  );
}

export default MainForMentor;
