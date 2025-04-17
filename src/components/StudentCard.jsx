import React, { useState } from "react";

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

const StudentCard = ({ student, status = "pending", onApprove, onReject }) => {
  const [localStatus, setLocalStatus] = useState(status);

  if (!student) return null;

  const handleApprove = () => {
    setLocalStatus("approved");
    if (onApprove) onApprove(student);
  };

  const handleReject = () => {
    setLocalStatus("rejected");
    if (onReject) onReject(student);
  };

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
    },
    actionButton: {
      padding: "10px 20px",
      fontSize: "14px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      margin: "10px",
      fontWeight: "600",
      transition: "background 0.3s",
    },
    approveButton: {
      background: "#4CAF50",
      color: "white",
    },
    rejectButton: {
      background: "#F44336",
      color: "white",
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.avatarContainer}>
        {student.avatarUrl && (
          <img
            src={student.avatarUrl}
            alt="Аватар студента"
            style={styles.avatar}
          />
        )}
      </div>
      <p style={styles.name}>
        {student.lastName} {student.firstName}
      </p>
      <div style={styles.info}>
        <p>
          <b>Вік:</b> {calculateAge(student.birthDate)}
        </p>
        <p>
          <b>Стать:</b> {student.gender || "Не вказано"}
        </p>
        <p>
          <b>Категорія навчання:</b> {student.category || "Не вказано"}
        </p>
        <p>
          <b>Email:</b> {student.email}
        </p>
        <p>
          <b>Опис:</b> {student.description || "Без опису"}
        </p>
      </div>

      {localStatus === "pending" ? (
        <div>
          <button
            style={{ ...styles.actionButton, ...styles.approveButton }}
            onClick={handleApprove}
          >
            Прийняти
          </button>
          <button
            style={{ ...styles.actionButton, ...styles.rejectButton }}
            onClick={handleReject}
          >
            Відхилити
          </button>
        </div>
      ) : (
        <p
          style={{
            ...styles.statusText,
            color: localStatus === "approved" ? "#4CAF50" : "#F44336",
          }}
        >
          {localStatus === "approved"
            ? "✅ Ви прийняли заявку на менторство"
            : "❌ Ви відхилили заявку на менторство"}
        </p>
      )}
    </div>
  );
};

export default StudentCard;
