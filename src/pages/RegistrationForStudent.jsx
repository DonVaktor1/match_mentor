import React, { useState, useEffect, useContext } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import "../styles/RegistrationForStudent.css";

function RegistrationForStudents() {
  const { setUser } = useContext(UserContext);
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");

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
        } else {
          setLastName(userData.lastName || "");
          setFirstName(userData.firstName || "");
          setBirthDate(userData.birthDate || "");
          setGender(userData.gender || "");
          setCategory(userData.category || "");
          setDescription(userData.description || "");
          setAvatarUrl(userData.avatarUrl || "");
        }
      } else {
        navigate("/login");
      }

      setLoading(false);
    };

    checkRegistration();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Будь ласка, оберіть зображення.");
    }
  };

  const handleSubmit = async () => {
    if (!lastName || !firstName || !birthDate || !gender || !category || !description) {
      alert("Будь ласка, заповніть усі поля.");
      return;
    }

    try {
      let uploadedAvatarUrl = avatarUrl;

      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        formData.append("upload_preset", "photoStudent");
        formData.append("cloud_name", "db5vk8c5c");

        const res = await fetch("https://api.cloudinary.com/v1_1/db5vk8c5c/image/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        uploadedAvatarUrl = data.secure_url;
        setAvatarUrl(uploadedAvatarUrl);
      }

      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        uid: auth.currentUser.uid, 
        lastName,
        firstName,
        birthDate,
        gender,
        category,
        description,
        avatarUrl: uploadedAvatarUrl || "",
        registrationCompleted: true,
      });

      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const updatedUserData = userSnap.data();

        setUser(updatedUserData);
        localStorage.setItem("user", JSON.stringify(updatedUserData));
        navigate("/main_for_student");
      }
    } catch (error) {
      alert("Помилка при збереженні даних: " + error.message);
    }
  };

  if (loading) return <p>Завантаження...</p>;

  return (
    <div className="container_Registartion_for_student">
      <h2>Я - Учень</h2>

      <div className="avatar-upload-container">
  <label htmlFor="avatar-upload" className="avatar-upload-label">
    {avatarUrl ? (
      <img src={avatarUrl} alt="Аватар" className="avatar-preview" />
    ) : (
      <div className="upload-placeholder">
        <p>Натисніть або перетягніть зображення сюди</p>
      </div>
    )}
  </label>
  <input
    type="file"
    id="avatar-upload"
    accept="image/*"
    onChange={handleImageChange}
    className="hidden-input"
  />
</div>

      <div className="row">
        <input
          type="text"
          placeholder="Прізвище"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="halfInput"
        />
        <input
          type="text"
          placeholder="Ім’я"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="halfInput"
        />
      </div>
      <input
        type="date"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        className="input"
      />
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
