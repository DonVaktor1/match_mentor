import React from "react";

function MainForStudent() {
  return (
    <div style={styles.container}>
      <h1>👨‍🎓 Ласкаво просимо, студенте!</h1>
      <p>Тут ти зможеш навчатися у найкращих менторів.</p>
    </div>
  );
}

const styles = {
  container: { textAlign: "center", padding: "50px", fontSize: "20px" },
};

export default MainForStudent;
