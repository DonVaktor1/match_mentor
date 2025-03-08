import React, { useContext} from "react";
import { UserContext } from "../UserContext";
import { useAuth } from "../hooks/useAuth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function MainForStudent() {
  useAuth(["student"]); 
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
      <h1>👨‍🎓 Welcome, {user ? `${user.lastName} ${user.firstName}` : "User"}!</h1>
      <p>Here, you can learn from the best mentors.</p>
      <button style={styles.button} onClick={handleLogout}>Log out</button>
    </div>
  );
}

const styles = {
  container: { textAlign: "center", padding: "50px", fontSize: "20px" },
  button: { marginTop: "20px", padding: "10px 20px", fontSize: "16px", cursor: "pointer" }
};

export default MainForStudent;
