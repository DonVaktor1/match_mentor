import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Header from "./pages/Header";
import ChooseAWay from "./pages/ChooseAWay";
import MainForStudent from "./pages/MainForStudent";
import MainForMentor from "./pages/MainForMentor";
import RegistrationForStudent from "./pages/RegistrationForStudent";
import RegistrationForMentor from "./pages/RegistrationForMentor";
import { UserProvider } from "./UserContext"; 

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration_for_student" element={<RegistrationForStudent />} />
        <Route path="/registration_for_mentor" element={<RegistrationForMentor />} />
        <Route path="/choose_a_way" element={<ChooseAWay />} />

        <Route path="/main_for_student" element={<WithHeader><MainForStudent /></WithHeader>} />
        <Route path="/main_for_mentor" element={<WithHeader><MainForMentor /></WithHeader>} />
      </Routes>
    </UserProvider>
  );
}

const WithHeader = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default App;
