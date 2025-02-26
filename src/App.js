import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ChooseAWay from "./pages/ChooseAWay";
import MainForStudent from "./pages/MainForStudent";
import MainForMentor from "./pages/MainForMentor";
import RegistrationForStudent from "./pages/RegistrationForStudent";
import RegistrationForMentor from "./pages/RegistrationForMentor";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registration_for_student" element={<RegistrationForStudent />} />
      <Route path="/registration_for_mentor" element={<RegistrationForMentor />} />
      <Route path="/login" element={<Login />} />
      <Route path="/choose_a_way" element={<ChooseAWay />} />
      <Route path="/main_for_student" element={<MainForStudent />} />
      <Route path="/main_for_mentor" element={<MainForMentor />} />
    </Routes>
  );
}

export default App;
