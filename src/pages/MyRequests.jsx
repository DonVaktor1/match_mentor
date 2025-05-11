import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import "../styles/MyRequests.css";
import MentorCard from "../components/MentorCard";

function MyRequests() {
  useAuth(["student"]);

  const { user } = useContext(UserContext);
  const [requestsWithMentors, setRequestsWithMentors] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requestsQuery = query(
          collection(db, "requests"),
          where("studentUid", "==", user.uid)
        );
        const requestsSnapshot = await getDocs(requestsQuery);

        const requests = await Promise.all(
          requestsSnapshot.docs.map(async (docSnap) => {
            const request = docSnap.data();
            const mentorRef = doc(db, "users", request.mentorUid);
            const mentorSnap = await getDoc(mentorRef);
            return {
              id: docSnap.id,
              status: request.status,
              mentor: mentorSnap.exists() ? { ...mentorSnap.data(), uid: request.mentorUid } : null,
            };
          })
        );

        setRequestsWithMentors(requests.filter((r) => r.mentor !== null));
      } catch (error) {
        console.error("Помилка завантаження заявок:", error);
      }
    };

    if (user) {
      fetchRequests();
    }
  }, [user]);

  const filteredRequests = statusFilter
    ? requestsWithMentors.filter((r) => r.status === statusFilter)
    : requestsWithMentors;

  return (
    <div className="my-requests-container">
      <h2>📋 Мої заявки</h2>

      <div className="filters">
        <label className="filter-label">
          Статус:
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Усі</option>
            <option value="pending">Очікує підтвердження</option>
            <option value="approved">Схвалені</option>
            <option value="rejected">Відхилені</option>
          </select>
        </label>
      </div>

      {filteredRequests.length > 0 ? (
        filteredRequests.map(({ id, mentor, status }) => (
          <div key={id} className="request-card">
            <MentorCard mentor={mentor} status={status} studentUid={user.uid} />
          </div>
        ))
      ) : (
        <p>Немає заявок, які відповідають обраному фільтру.</p>
      )}
    </div>
  );
}

export default MyRequests;
