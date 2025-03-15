import React, { useState, useContext } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { UserContext } from "../UserContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); 

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        if (!userData.registrationCompleted) {
          navigate(userData.role === "student" ? "/registration_for_student" : "/registration_for_mentor");
        } else {
          navigate(userData.role === "student" ? "/main_for_student" : "/main_for_mentor");
        }
      } else {
        alert("Користувача не знайдено в базі.");
      }
    } catch (error) {
      alert("Помилка входу: " + error.message);
    }
  };

  return (
    <div className="container_Login">
      <h2>Вхід</h2>
      <input
        type="email"
        placeholder="Пошта"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input"
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input"
      />
      <button onClick={handleLogin} className="button" style={{ background: "#B2F2FF" }}>
        Увійти
      </button>
      <p>Досі нема акаунту?</p>
      <button onClick={() => navigate("/choose_a_way")} className="button" style={{ background: "#90EE90" }}>
        Приєднатися
      </button>
    </div>
  );
}

export default Login;
