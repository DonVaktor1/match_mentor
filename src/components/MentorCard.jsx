import React from "react";
import { useNavigate } from "react-router-dom";

const calculateAge = (birthDate) => {
  const birth = new Date(birthDate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  const dayDiff = today.getDate() - birth.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age > 0 ? age : "Невідомо";
};

const MentorCard = ({ mentor, status }) => {
  const navigate = useNavigate();

  if (!mentor) return null;

  const goToDetails = () => {
    navigate(`/details/${mentor.id}`, { state: { mentor } });
  };

  let statusText = "";
  let statusColor = "";

  switch (status) {
    case "approved":
      statusText = "✅ Вашу заявку прийнято";
      statusColor = "#4CAF50"; 
      break;
    case "rejected":
      statusText = "❌ Вашу заявку відхилено";
      statusColor = "#F44336"; 
      break;
    case "pending":
    default:
      statusText = "⏳ Вашу заявку надіслано";
      statusColor = "#2196F3"; 
      break;
  }

  const styles = {
    card: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "500px",
      padding: "20px",
      background: "#f5f5f5",
      borderRadius: "12px",
      marginBottom: "20px",
      textAlign: "center",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      position: "relative",
    },
    avatarContainer: {
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      overflow: "hidden",
      background: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "10px",
      boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
    },
    avatar: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    name: {
      fontSize: "22px",
      fontWeight: "600",
      marginBottom: "10px",
    },
    info: {
      textAlign: "left",
      width: "100%",
      fontSize: "16px",
    },
    statusText: {
      marginTop: "15px",
      fontWeight: "bold",
      fontSize: "16px",
      color: statusColor,
      
    },
    detailsButton: {
      position: "absolute",
      bottom: "10px",
      right: "10px",
      padding: "10px 15px",
      fontSize: "14px",
      background: "#66ff99",
      color: "black",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.avatarContainer}>
        {mentor.avatarUrl && (
          <img src={mentor.avatarUrl} alt="Аватар" style={styles.avatar} />
        )}
      </div>
      <p style={styles.name}>
        {mentor.lastName} {mentor.firstName}
      </p>
      <div style={styles.info}>
        <p>
          <b>Вік:</b> {calculateAge(mentor.birthDate)}
        </p>
        <p>
          <b>Категорія:</b> {mentor.category}
        </p>
        <p>
          <b>Стаж роботи:</b> {mentor.experience || "Не вказано"}
        </p>
        <p>
          <b>Рейтинг:</b> {mentor.rating || "Відсутній"}
        </p>
      </div>

      {status && <p style={styles.statusText}>{statusText}</p>}

      <button style={styles.detailsButton} onClick={goToDetails}>
        Деталі
      </button>
    </div>
  );
};

export default MentorCard;
