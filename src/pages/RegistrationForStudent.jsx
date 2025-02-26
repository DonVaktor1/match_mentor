import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/RegistrationForStudent.css";


function RegistrationForStudents() {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkRegistration = async () => {
      if (!auth.currentUser) {
        navigate("/login");
        return;
      }

      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.registrationCompleted) {
          navigate("/main_for_student");
        }
      } else {
        navigate("/login");
      }

      setLoading(false);
    };

    checkRegistration();
  }, [navigate]);

  const handleSubmit = async () => {
    if (!lastName || !firstName || !birthDate || !gender || !category || !description) {
      alert("Будь ласка, заповніть усі поля.");
      return;
    }

    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        lastName,
        firstName,
        birthDate,
        gender,
        category,
        description,
        registrationCompleted: true,
      });
      navigate("/main_for_student");
    } catch (error) {
      alert("Помилка при збереженні даних: " + error.message);
    }
  };

  if (loading) return <p>Завантаження...</p>;

  return (
    <div className="container">
  <h2>Я - Учень</h2>
  <div className="row">
    <input type="text" placeholder="Прізвище" value={lastName} onChange={(e) => setLastName(e.target.value)} className="halfInput" />
    <input type="text" placeholder="Ім’я" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="halfInput" />
  </div>
  <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="input" />
  <select value={gender} onChange={(e) => setGender(e.target.value)} className="input">
    <option value="">Оберіть стать</option>
    <option value="Чоловіча">Чоловіча</option>
    <option value="Жіноча">Жіноча</option>
  </select>
  <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
    <option value="">Оберіть категорію</option>
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
  <textarea placeholder="Опис" value={description} onChange={(e) => setDescription(e.target.value)} className="textarea" />
  <button onClick={handleSubmit} className="button">Зареєструватись</button>
</div>

  );
}



export default RegistrationForStudents;
