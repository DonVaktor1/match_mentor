import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { useAuth } from "../hooks/useAuth";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import MentorCard from "../components/MentorCard";
import "../styles/MainForStudent.css";

function MainForStudent() {
  useAuth(["student"]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "mentor"));
        const querySnapshot = await getDocs(q);
        const mentorsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMentors(mentorsList);
      } catch (error) {
        console.error("Помилка завантаження менторів:", error);
      }
    };

    fetchMentors();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (!user) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <div className="main-student-container">
      <h1>👨‍🎓 Вітаємо, {user ? `${user.lastName} ${user.firstName}` : "Студент"}!</h1>
      <p>Тут ти можеш знайти найкращих менторів.</p>
  
      <div className="mentors-container">
        {mentors.length > 0 ? (
          mentors.map((mentor) => <MentorCard key={mentor.id} mentor={mentor} />)
        ) : (
          <p>Немає доступних менторів.</p>
        )}
      </div>
  
      <button className="logout-button" onClick={handleLogout}>Вийти</button>
    </div>
  );
  
}


export default MainForStudent;
