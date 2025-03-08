import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import "../styles/RegistrationForMentor.css";


function RegistrationForMentor() {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);


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
          navigate("/main_for_mentor");
        }
      } else {
        navigate("/login");
      }

      setLoading(false);
    };

    checkRegistration();
  }, [navigate]);

  const handleSubmit = async () => {
    if (!lastName || !firstName || !birthDate || !gender || !category || !experience || !description) {
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
        experience,
        description,
        registrationCompleted: true,
      });
  
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
  
      if (userSnap.exists()) {
        const updatedUserData = userSnap.data();
        setUser(updatedUserData); 
        localStorage.setItem("user", JSON.stringify(updatedUserData)); 
      }
      navigate("/main_for_mentor");
    } catch (error) {
      alert("Помилка при збереженні даних: " + error.message);
    }
  };
  

  if (loading) return <p>Завантаження...</p>;

  return (
    <div className="container">
  <h2>Я - Ментор</h2>
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
  <select value={experience} onChange={(e) => setExperience(e.target.value)} className="input">
    <option value="">Оберіть досвід роботи</option>
    <option value="Менше 1 року">Менше 1 року</option>
    <option value="1-3 роки">1-3 роки</option>
    <option value="3-5 років">3-5 років</option>
    <option value="5-10 років">5-10 років</option>
    <option value="10+ років">10+ років</option>
  </select>
  <textarea placeholder="Опис" value={description} onChange={(e) => setDescription(e.target.value)} className="textarea" />
  <button onClick={handleSubmit} className="button">Зареєструватись</button>
</div>

  );
}

export default RegistrationForMentor;
