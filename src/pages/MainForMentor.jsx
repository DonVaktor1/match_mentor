import React, { useContext } from "react";
import { UserContext } from "../UserContext";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


function MainForMentor() {
   useAuth(["mentor"]); 
   const { user } = useContext(UserContext);
   const navigate = useNavigate();
 
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
    <div style={styles.container}>
      <h1>👨‍🏫 Вітаємо, {user ? `${user.lastName} ${user.firstName}` : "наставнику"}!</h1>
      <p>Тут ти можеш ділитися знаннями з іншими учнями.</p>
      <button style={styles.button} onClick={handleLogout}>
        Вийти
      </button>
    </div>
  );
}

const styles = {
  container: { textAlign: "center", padding: "50px", fontSize: "20px" },
  button: { marginTop: "20px", padding: "10px 20px", fontSize: "16px", cursor: "pointer" },
};

export default MainForMentor;
