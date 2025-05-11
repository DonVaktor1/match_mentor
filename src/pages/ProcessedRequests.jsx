import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import StudentCard from "../components/StudentCard";
import { useAuth } from "../hooks/useAuth";

function ProcessedRequests() {
  useAuth(["mentor"]);

  const { user } = useContext(UserContext);
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

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


  const filteredRequests = statusFilter
    ? requests.filter((r) => r.status === statusFilter)
    : requests;

  return (
    <div className="container">
      <h1>Оброблені заявки</h1>

      <div className="filters">
        <label className="filter-label">
          Статус:
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Усі</option>
            <option value="approved">Схвалені</option>
            <option value="rejected">Відхилені</option>
          </select>
        </label>
      </div>

      <div className="requestsContainer">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <div key={request.id} className="cardWrapper">
              <StudentCard
                student={request.studentData}
                status={request.status}
                mentorUid={user?.uid}
              />
            </div>
          ))
        ) : (
          <p>Оброблених заявок, які відповідають обраному фільтру, поки що немає.</p>
        )}
      </div>
    </div>
  );
}

export default ProcessedRequests;
