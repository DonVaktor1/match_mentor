import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/MyRequests.css";
import MentorCard from "../components/MentorCard";

function MyRequests() {
  const { user } = useContext(UserContext);
  const [requestsWithMentors, setRequestsWithMentors] = useState([]);

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
              mentor: mentorSnap.exists() ? mentorSnap.data() : null,
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

  return (
    <div className="my-requests-container">
      <h2>📋 Мої заявки</h2>
      {requestsWithMentors.length > 0 ? (
        requestsWithMentors.map(({ id, mentor, status }) => (
          <div key={id} className="request-card">
            <MentorCard mentor={mentor} status={status} />
          </div>
        ))
      ) : (
        <p>У вас ще немає заявок.</p>
      )}
    </div>
  );  
}

export default MyRequests;
