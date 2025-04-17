import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import StudentCard from "../components/StudentCard";
import "../styles/ProcessedRequests.css";

function ProcessedRequests() {
  const { user } = useContext(UserContext);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchProcessedRequests = async () => {
      try {
        const q = query(collection(db, "requests"), where("mentorUid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const processed = await Promise.all(
          querySnapshot.docs.map(async (requestDoc) => {
            const data = requestDoc.data();
            if (data.status === "pending") return null;

            const studentRef = doc(db, "users", data.studentUid);
            const studentSnap = await getDoc(studentRef);
            const studentData = studentSnap.exists() ? studentSnap.data() : null;

            return {
              id: requestDoc.id,
              ...data,
              studentData,
            };
          })
        );

        setRequests(processed.filter(Boolean));
      } catch (error) {
        console.error("Помилка завантаження оброблених заявок:", error);
      }
    };

    if (user?.uid) fetchProcessedRequests();
  }, [user?.uid]);

  return (
    <div className="container">
      <h1>📂 Оброблені заявки</h1>
      <div className="requestsContainer">
        {requests.length > 0 ? (
          requests.map((request) => (
            <div key={request.id} className="cardWrapper">
              <StudentCard student={request.studentData} status={request.status} />
            </div>
          ))
        ) : (
          <p>Оброблених заявок поки що немає.</p>
        )}
      </div>
    </div>
  );
}

export default ProcessedRequests;
