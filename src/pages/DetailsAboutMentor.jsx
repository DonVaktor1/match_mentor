import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot,
  doc,
  runTransaction,
} from "firebase/firestore";
import { UserContext } from "../UserContext";
import '../styles/DetailsAboutMentor.css';

const DetailsAboutMentor = () => {
  const location = useLocation();
  const mentor = location.state?.mentor;
  const { user } = useContext(UserContext);

  const [isRequested, setIsRequested] = useState(false);
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(5);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [mentorRating, setMentorRating] = useState(mentor.rating);
  const [canComment, setCanComment] = useState(false);
  const [hasCommented, setHasCommented] = useState(false);

  useEffect(() => {
    if (!mentor) return;
  
    const mentorRef = doc(db, "users", mentor.uid);
  
    const unsubscribe = onSnapshot(mentorRef, (doc) => {
      if (doc.exists()) {
        setMentorRating(doc.data().rating || "5.0");
      }
    });
  
    return () => unsubscribe();
  }, [mentor]);

  useEffect(() => {
    if (!mentor || !user) return;
  
    const checkPermissions = async () => {
      try {
        const requestQuery = query(
          collection(db, "requests"),
          where("mentorUid", "==", mentor.uid),
          where("studentUid", "==", user.uid)
        );
        const requestSnapshot = await getDocs(requestQuery);
        if (!requestSnapshot.empty) {
          requestSnapshot.forEach((doc) => {
            const request = doc.data();
            switch (request.status) {
              case "approved":
                setCanComment(true); 
                setIsRequested("approved");
                break;
              case "rejected":
                setIsRequested("rejected"); 
                break;
              case "pending":
                setIsRequested("pending");
                break;
              default:
                setIsRequested(null);
                break;
            }
          });
        } else {
          setIsRequested(null); 
        }
  
        const commentQuery = query(
          collection(db, "comments"),
          where("mentorUid", "==", mentor.uid),
          where("studentUid", "==", user.uid)
        );
        const commentSnapshot = await getDocs(commentQuery);
  
        if (!commentSnapshot.empty) {
          setHasCommented(true); 
        }
        setLoading(false); 
      } catch (error) {
        console.error("Помилка при перевірці прав доступу:", error);
        setLoading(false);
      }
    };
  
    checkPermissions();
  }, [mentor, user]);
  
  

  useEffect(() => {
    if (!mentor) return;
    
    const q = query(
      collection(db, "comments"),
      where("mentorUid", "==", mentor.uid),
      orderBy("timestamp", "desc")
    );
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(fetchedComments);
  
      if (fetchedComments.length > 0) {
        const totalRating = fetchedComments.reduce((sum, c) => sum + c.rating, 0);
        setRating((totalRating / fetchedComments.length).toFixed(1));
      } else {
        setRating("5.0");
      }
    });
  
    return () => unsubscribe();
  }, [mentor]);

  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();
  
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
  
    return age > 0 ? age : "Невідомо";
  };

  const initials = user
  ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  : "?";

  const sendRequest = async () => {
    if (!user) return alert("Ви повинні бути авторизовані!");
    if (isRequested === "approved") return alert("Ваша заявка вже була схвалена!");
    if (isRequested === "rejected") return alert("Ваша заявка була відхилена!");
    if (isRequested === "pending") return alert("Заявка вже надіслана, чекайте підтвердження!");
  
    try {
      await addDoc(collection(db, "requests"), {
        mentorUid: mentor.uid,
        mentorName: `${mentor.lastName} ${mentor.firstName}`,
        studentUid: user.uid,
        studentName: `${user.lastName} ${user.firstName}`,
        status: "pending", 
        timestamp: new Date(),
      });
      setIsRequested("pending");
      alert("Заявка надіслана!");
    } catch (error) {
      console.error("Помилка при надсиланні заявки:", error);
    }
  };
  

  const handleSubmit = async () => {
    if (!commentText.trim()) return alert("Коментар не може бути порожнім!");
    if (!user) return alert("Ви повинні бути авторизовані!");
    if (!canComment) return alert("Ви можете залишити коментар тільки після схвалення заявки ментором!");
    if (hasCommented) return alert("Ви вже залишили коментар!");
  
    try {
      console.log("=== Початок handleSubmit ===");
      console.log("Користувач:", user);
      console.log("Ментор:", mentor);
      console.log("mentor.uid:", mentor?.uid);
  
      const commentQuery = query(
        collection(db, "comments"),
        where("mentorUid", "==", mentor.uid),
        where("studentUid", "==", user.uid)
      );
  
      const commentSnapshot = await getDocs(commentQuery);
  
      if (!commentSnapshot.empty) {
        return alert("Ви вже залишили коментар!");
      }
  
      await addDoc(collection(db, "comments"), {
        mentorUid: mentor.uid,
        studentUid: user.uid,
        studentName: `${user.lastName} ${user.firstName}`,
        rating: Number(rating),
        comment: commentText,
        timestamp: new Date(),
      });
  
      const mentorRef = doc(db, "users", mentor.uid); 
      console.log("Шлях до документа ментора:", mentorRef.path);
  
      await runTransaction(db, async (transaction) => {
        console.log("Запускаємо транзакцію...");
  
        const mentorDoc = await transaction.get(mentorRef);
        console.log("mentorDoc.exists():", mentorDoc.exists());
  
        if (!mentorDoc.exists()) {
          throw new Error("Ментор не знайдений у Firestore!");
        }
  
        const snapshot = await getDocs(
          query(collection(db, "comments"), where("mentorUid", "==", mentor.uid)) 
        );
  
        let totalRating = 0;
        let ratingCount = 0;
  
        snapshot.forEach((doc) => {
          const commentRating = Number(doc.data().rating);
          if (!isNaN(commentRating)) {
            totalRating += commentRating;
            ratingCount++;
          }
        });
  
        const averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : "5.0";
        console.log("Новий середній рейтинг:", averageRating);
  
        transaction.update(mentorRef, {
          rating: parseFloat(averageRating),
        });
  
        setMentorRating(averageRating);
      });
  
      setHasCommented(true);
      setCommentText("");
      setRating(5);
      console.log("Коментар успішно додано!");
    } catch (error) {
      console.error("Помилка при додаванні коментаря:", error);
    }
  };

  if (loading) return null;
  if (!mentor) return <p>Ментор не знайдений</p>;

  return (
  <div className="mentor-wrapper">
    <div className="mentor-card">
      <div className="mentor-profileSection">
        {mentor.avatarUrl ? (
          <img src={mentor.avatarUrl} alt="Аватар" className="mentor-avatar" />
        ) : (
          <div className="mentor-initialsAvatar">{initials}</div>
        )}
        <div>
          <p className="mentor-name">
            {mentor.lastName} {mentor.firstName}
          </p>
        </div>
      </div>

      <div className="mentor-details">
        <p><b>Вік:</b> {calculateAge(mentor.birthDate)}</p>
        <p><b>Стать:</b> {mentor.gender || "Не вказано"}</p>
        <p><b>Категорія:</b> {mentor.category || "Не вказано"}</p>
        <p><b>Досвід:</b> {mentor.experience || "Не вказано"}</p>
        <p><b>Рейтинг:</b> {mentorRating}</p>
        <p><b>Опис:</b> {mentor.description || "Немає опису"}</p>
      </div>

      <div className="mentor-requestSection">
        {isRequested === null && !isRequested ? (
          <button onClick={sendRequest} className="mentor-buttonSendRequest">
            Подати заявку
          </button>
        ) : isRequested === "pending" ? (
          <p className="mentor-requestSent">Заявка надіслана, чекайте підтвердження.</p>
        ) : isRequested === "approved" ? (
          <p className="mentor-requestSent">Заявка схвалена, ви можете залишити коментар.</p>
        ) : isRequested === "rejected" ? (
          <p className="mentor-requestSent rejected-text">Ваша заявка була відхилена.</p>
        ) : (
          <p className="mentor-requestSent">Заявка вже надіслана!</p>
        )}
      </div>
    </div>

    <div className="mentor-commentsSection">
      <h3>Коментарі</h3>
      {user && (
        <div className="mentor-commentInputWrapper">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Напишіть коментар..."
            className="mentor-textarea"
          />
          <div className="mentor-ratingRow">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                className="mentor-star"
                style={{ color: star <= rating ? "#FFD700" : "#ccc" }}
              >
                ★
              </span>
            ))}
            <button onClick={handleSubmit} className="mentor-commentButton">
              Залишити коментар
            </button>
          </div>
        </div>
      )}
      {comments.length === 0 ? (
        <p>Немає коментарів</p>
      ) : (
        <ul className="mentor-commentList">
          {comments.map((c, index) => (
            <li key={index} className="mentor-commentItem">
              <div className="mentor-commentName">{c.studentName}</div>
              <div className="mentor-commentStars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    style={{
                      color: star <= c.rating ? "#FFD700" : "#ccc",
                      fontSize: "20px",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="mentor-commentText">{c.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);
};


export default DetailsAboutMentor;
