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
        <a href="/search">Пошук</a>
        <a href="/applications">Мої заявки</a>
        <a href="/chat">Чат</a>
      </nav>
    </div>
  );
};

export default Header;
