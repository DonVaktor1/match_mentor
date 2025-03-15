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
      background: "#eee",
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
      padding: "0 20px",
    },
    buttons: {
      display: "flex",
      justifyContent: "center",
      gap: "10px",
      marginTop: "15px",
    },
    button: {
      padding: "10px 20px",
      fontSize: "14px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      color: "white",
    },
    approveButton: {
      background: "#28a745",
    },
    rejectButton: {
      background: "#dc3545",
    },
    statusText: {
      fontWeight: "bold",
      marginTop: "10px",
      color:
        localStatus === "approved"
          ? "#28a745"
          : localStatus === "rejected"
          ? "#dc3545"
          : "#f39c12",
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
        <div style={styles.buttons}>
          <button
            style={{ ...styles.button, ...styles.approveButton }}
            onClick={handleApprove}
          >
            Прийняти заявку
          </button>
          <button
            style={{ ...styles.button, ...styles.rejectButton }}
            onClick={handleReject}
          >
            Відхилити заявку
          </button>
        </div>
      ) : (
        <p style={styles.statusText}>
          {localStatus === "approved"
            ? "✅ Заявку прийнято"
            : "❌ Заявку відхилено"}
        </p>
      )}
    </div>
  );
};

export default StudentCard;
