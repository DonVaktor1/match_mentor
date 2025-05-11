import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { useAuth } from "../hooks/useAuth";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import MentorCard from "../components/MentorCard";
import "../styles/MainForStudent.css";

function MainForStudent() {
  useAuth(["student"]);
  const { user } = useContext(UserContext);
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [category, setCategory] = useState("");
  const [experience, setExperience] = useState("");

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const requestsQuery = query(
          collection(db, "requests"),
          where("studentUid", "==", user.uid)
        );
        const requestsSnapshot = await getDocs(requestsQuery);
        const sentMentorUids = requestsSnapshot.docs.map(doc => doc.data().mentorUid);
        const mentorsQuery = query(
          collection(db, "users"),
          where("role", "==", "mentor")
        );
        const mentorsSnapshot = await getDocs(mentorsQuery);
        const allMentors = mentorsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const availableMentors = allMentors.filter(
          mentor => !sentMentorUids.includes(mentor.uid)
        );

        setMentors(availableMentors);
        setFilteredMentors(availableMentors);
      } catch (error) {
        console.error("Помилка при завантаженні менторів або заявок:", error);
      }
    };

    if (user) {
      fetchMentors();
    }
  }, [user]);

  useEffect(() => {
    let filtered = mentors;

    if (category) {
      filtered = filtered.filter(m => m.category === category);
    }

    if (experience) {
      filtered = filtered.filter(m => m.experience === experience);
    }

    setFilteredMentors(filtered);
  }, [category, experience, mentors]);

  if (!user) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <div className="main-student-container">
      <h1>Вітаємо, {`${user.lastName} ${user.firstName}`}!</h1>
      <p>Тут ти можеш знайти найкращих менторів.</p>

      <div className="filters">
  <label className="filter-label">
    Категорія:
    <select value={category} onChange={(e) => setCategory(e.target.value)} className="filter-select">
      <option value="">Усі</option>
      <option value="Програмування">Програмування</option>
      <option value="Дизайн">Дизайн</option>
      <option value="Математика">Математика</option>
      <option value="Фізика">Фізика</option>
      <option value="Хімія">Хімія</option>
      <option value="Література">Література</option>
      <option value="Музика">Музика</option>
      <option value="Спорт">Спорт</option>
      <option value="Мови">Мови</option>
      <option value="Бізнес">Бізнес</option>
      <option value="Інше">Інше</option>
    </select>
  </label>

  <label className="filter-label">
    Досвід:
    <select value={experience} onChange={(e) => setExperience(e.target.value)} className="filter-select">
      <option value="">Усі</option>
      <option value="Менше 1 року">Менше 1 року</option>
      <option value="1-3 роки">1-3 роки</option>
      <option value="3-5 років">3-5 років</option>
      <option value="5-10 років">5-10 років</option>
      <option value="10+ років">10+ років</option>
    </select>
  </label>
</div>

      <div className="mentors-container">
        {filteredMentors.length > 0 ? (
          filteredMentors.map((mentor) => <MentorCard key={mentor.id} mentor={mentor} />)
        ) : (
          <p>Немає менторів, які відповідають обраним фільтрам.</p>
        )}
      </div>
    </div>
  );
}

export default MainForStudent;
