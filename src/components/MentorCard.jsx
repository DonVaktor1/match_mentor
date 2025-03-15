import React, { useState } from "react";
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

const MentorCard = ({ mentor }) => {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  if (!mentor) return null;

  const toggleLike = () => setLiked(!liked);

  const goToDetails = () => {
    navigate(`/details/${mentor.id}`, { state: { mentor } });
  };

  const styles = {
    card: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "500px",
      padding: "20px",
      background: "#ddd",
      borderRadius: "10px",
      marginBottom: "10px",
      textAlign: "center",
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
    },
    avatar: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    name: {
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    info: {
      textAlign: "left",
      width: "100%",
    },
    heart: {
      fontSize: "24px",
      color: liked ? "red" : "black",
      cursor: "pointer",
      position: "absolute",
      right: "15px",
      top: "50%",
      transform: "translateY(-50%)",
    },
    detailsButton: {
      position: "absolute",
      bottom: "10px",
      right: "10px",
      padding: "10px 15px",
      fontSize: "14px",
      background: "#007bff",
      color: "white",
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
      <p style={styles.name}>{mentor.lastName} {mentor.firstName}</p>
      <div style={styles.info}>
        <p><b>Вік:</b> {calculateAge(mentor.birthDate)}</p>
        <p><b>Стаж роботи:</b> {mentor.experience || "Не вказано"}</p>
        <p><b>Рейтинг:</b> {mentor.rating || "5.0"}</p>
      </div>
      <div style={styles.heart} onClick={toggleLike}>
        {liked ? "❤️" : "🤍"}
      </div>
      <button style={styles.detailsButton} onClick={goToDetails}>Деталі</button>
    </div>
  );
};

export default MentorCard;
