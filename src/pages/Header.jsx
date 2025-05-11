import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import "../styles/Header.css";

const Header = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "?";

  const handleProfileClick = () => {
    navigate("/account_settings");
  };

  return (
    <div className="header">
      <div className="user-info" onClick={handleProfileClick} style={{ cursor: "pointer" }}>
        <div className="circle">
          {user && user.avatarUrl ? (
            <img src={user.avatarUrl} alt="Аватар" className="avatar" />
          ) : (
            <span className="initials">{initials}</span>
          )}
        </div>
        <span className="title">{user ? `${user.lastName} ${user.firstName}` : "Користувач"}</span>
      </div>

      <nav>
        <a href={user?.role === "mentor" ? "/main_for_mentor" : "/main_for_student"}>Пошук</a>
        <a href={user?.role === "mentor" ? "/processed_requests" : "/myrequests"}>Мої заявки</a>
        {user?.role === "mentor" && (
          <a href="/mycomments">Мої коментарі</a>
        )}
         <a href={"/chat/:mentorUid/:studentUid"}>Чат</a>
      </nav>
    </div>
  );
};

export default Header;
