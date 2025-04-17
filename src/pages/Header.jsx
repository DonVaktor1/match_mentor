import React, { useContext } from "react";
import { UserContext } from "../UserContext";
import "../styles/Header.css";

const Header = () => {
  const { user } = useContext(UserContext);
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "?";

  return (
    <div className="header">
      <div className="user-info">
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
        <a href={user?.role === "mentor" ? "/main_for_mentor" : "/main_for_student"}>
          Пошук
        </a>
  
        <a href={user?.role === "mentor" ? "/processed_requests" : "/myrequests"}>
          Мої заявки
        </a>
      </nav>
    </div>
  );
};

export default Header;
