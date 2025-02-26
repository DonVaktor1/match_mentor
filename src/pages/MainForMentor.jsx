import React from "react";

function MainForMentor() {
  return (
    <div style={styles.container}>
      <h1>👨‍🏫 Вітаємо, наставнику!</h1>
      <p>Тут ти можеш ділитися знаннями з іншими.</p>
    </div>
  );
}

const styles = {
  container: { textAlign: "center", padding: "50px", fontSize: "20px" },
};

export default MainForMentor;
