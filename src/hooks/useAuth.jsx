import { useContext, useEffect } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

export const useAuth = (allowedRoles) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!allowedRoles.includes(user.role)) {
      navigate(user.role === "student" ? "/main_for_student" : "/main_for_mentor");
    }
  }, [user, navigate, allowedRoles]);
};
