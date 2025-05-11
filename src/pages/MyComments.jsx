import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { UserContext } from "../UserContext";
import "../styles/MyComments.css";

const MyCommentsPage = () => {
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [averageRating, setAverageRating] = useState("—");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    if (user.role !== "mentor") {
      navigate("/not_found");
      return;
    }

    const q = query(
      collection(db, "comments"),
      where("mentorUid", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setComments(fetched);

      if (fetched.length > 0) {
        const sum = fetched.reduce((acc, c) => acc + c.rating, 0);
        setAverageRating((sum / fetched.length).toFixed(1));
      } else {
        setAverageRating("—");
      }
    });

    return () => unsubscribe();
  }, [user, navigate]);

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return "—";
    const date = timestamp.toDate();
    return date.toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (!user || user.role !== "mentor") return null;

  return (
    <div className="my-comments-container">
      <h2>Мої коментарі</h2>
      <p className="average-rating">Середня оцінка: <strong>{averageRating}</strong></p>

      {comments.length === 0 ? (
        <p>Коментарів ще немає.</p>
      ) : (
        <ul className="comments-list">
          {comments.map((comment) => (
            <li key={comment.id} className="comment-item">
              <div className="comment-header">
                <div className="student-name">{comment.studentName}</div>
                <div className="comment-date">{formatDate(comment.timestamp)}</div>
              </div>

              <div className="comment-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    style={{
                      color: star <= comment.rating ? "#FFD700" : "#ccc",
                      fontSize: "20px",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>

              <p className="comment-text">{comment.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyCommentsPage;
