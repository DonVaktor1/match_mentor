import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { auth } from "../firebase";
import { useAuth } from "../hooks/useAuth"; 
import "../styles/AccountSettings.css";

const AccountSettings = () => {
  useAuth(["student", "mentor"]);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  if (!user) return <div>Loading user info...</div>;

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
    <div className="main-student-container">
      <h2>Налаштування акаунта</h2>
      <div className="profile-card">
        <img src={user.avatarUrl} alt="Avatar" className="settings-avatar" />
        <h3>{user.lastName} {user.firstName}</h3>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Стать:</strong> {user.gender}</p>
        <p><strong>Дата народження:</strong> {user.birthDate}</p>
        <p><strong>Категорія:</strong> {user.category}</p>
        <p><strong>Опис:</strong> {user.description}</p>

        {user.role === "mentor" && (
          <p><strong>Досвід:</strong> {user.experience}</p>
        )}
        <p><strong>Роль:</strong> {user.role === "mentor" ? "Ментор" : "Студент"}</p>
      </div>

      <button className="logoutButton" onClick={handleLogout}>
        Вийти
      </button>
    </div>
  );
};

export default AccountSettings;
