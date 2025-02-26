import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/ChooseAWay.css";

function ChooseAWay() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (role) => {
    if (password !== confirmPassword) {
      alert("Паролі не співпадають!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: role,
        registrationCompleted: false,
      });

      console.log("Роль користувача:", role);

      if (role === "student") {
        navigate("/registration_for_student");
      } else if (role === "mentor") {
        navigate("/registration_for_mentor");
      } else {
        console.error("Невідома роль:", role);
      }
    } catch (error) {
      alert("Помилка реєстрації: " + error.message);
    }
  };

  return (
    <div className="container">
  <h3>Реєстрація</h3>
  <input type="email" placeholder="Пошта" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
  <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
  <input type="password" placeholder="Підтвердження паролю" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input" />

  <h3>Яка Ваша ціль?</h3>

  <button onClick={() => handleRegister("student")} className="button" style={{ background: "#90EE90" }}>
    Я прагну отримати нові знання з наставником
  </button>
  <button onClick={() => handleRegister("mentor")} className="button" style={{ background: "#AFEEEE" }}>
    Я прагну ділитися своїми знаннями з іншими
  </button>
</div>

  );
}


export default ChooseAWay;
