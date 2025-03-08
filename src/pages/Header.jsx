import React, { useContext } from "react";
import { UserContext } from "../UserContext";
import "../styles/Header.css";

const Header = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="header">
      <div className="circle">№1</div>
      <span className="title">{user ? `${user.lastName} ${user.firstName}` : "Користувач"}</span>
      <nav>
        <a href="/search">Пошук</a>
        <a href="/applications">Мої заявки</a>
        <a href="/chat">Чат</a>
      </nav>
    </div>
  );
};

export default Header;
