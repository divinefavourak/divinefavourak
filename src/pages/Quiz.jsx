import React, { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useExamLoginOpen } from "../utils/examAccess.js";
import "../styles/quiz.css";

/** Set by Login.jsx on a successful password check. */
export const QUIZ_USER_KEY = "quizUser";

const QUESTIONS = [
  {
    id: "q1",
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Mercury"],
    answer: "Mars",
  },
  {
    id: "q2",
    text: "What is the capital city of Nigeria?",
    options: ["Lagos", "Kano", "Abuja", "Ibadan"],
    answer: "Abuja",
  },
  {
    id: "q3",
    text: "How many continents are there on Earth?",
    options: ["5", "6", "7", "8"],
    answer: "7",
  },
  {
    id: "q4",
    text: "Who wrote the play “Romeo and Juliet”?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Homer"],
    answer: "William Shakespeare",
  },
  {
    id: "q5",
    text: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    answer: "Pacific Ocean",
  },
  {
    id: "q6",
    text: "Which gas do plants absorb from the air during photosynthesis?",
    options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
    answer: "Carbon dioxide",
  },
  {
    id: "q7",
    text: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    answer: "Au",
  },
  {
    id: "q8",
    text: "In what year did Nigeria gain independence?",
    options: ["1957", "1960", "1963", "1966"],
    answer: "1960",
  },
  {
    id: "q9",
    text: "Which is the longest river in Africa?",
    options: ["River Niger", "Congo River", "The Nile", "Zambezi River"],
    answer: "The Nile",
  },
  {
    id: "q10",
    text: "How many players does a football team have on the pitch at one time?",
    options: ["9", "10", "11", "12"],
    answer: "11",
  },
];

function Quiz() {
  const navigate = useNavigate();
  const loginOpen = useExamLoginOpen();
  const cardRefs = useRef({});

  const [user] = useState(() => sessionStorage.getItem(QUIZ_USER_KEY));
  const [answers, setAnswers] = useState({});
  const [missing, setMissing] = useState([]);
  const [result, setResult] = useState(null);

  // Reached /quiz without passing the login gate.
  if (!user) return <Navigate to="/login" replace />;

  if (!loginOpen) {
    return (
      <div className="gq-page">
        <div className="gq-shell">
          <div className="gq-card gq-card-head">
            <h1 className="gq-title">Quiz closed</h1>
            <p className="gq-desc">This form is no longer accepting responses.</p>
          </div>
        </div>
      </div>
    );
  }

  const select = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
    setMissing((prev) => prev.filter((id) => id !== questionId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const unanswered = QUESTIONS.filter((q) => !answers[q.id]).map((q) => q.id);
    if (unanswered.length > 0) {
      setMissing(unanswered);
      cardRefs.current[unanswered[0]]?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const score = QUESTIONS.reduce((total, q) => total + (answers[q.id] === q.answer ? 1 : 0), 0);
    setResult({ score, answers });
    window.scrollTo(0, 0);
    document.querySelector(".gq-page")?.scrollTo(0, 0);
  };

  const reset = () => {
    setAnswers({});
    setMissing([]);
    setResult(null);
    document.querySelector(".gq-page")?.scrollTo(0, 0);
  };

  if (result) {
    return (
      <div className="gq-page">
        <div className="gq-shell">
          <div className="gq-card gq-card-head">
            <h1 className="gq-title">General Knowledge Quiz</h1>
            <p className="gq-desc">Your response has been recorded.</p>
            <p className="gq-score">
              {result.score}/{QUESTIONS.length}
            </p>
            <p className="gq-desc">Points, {user}.</p>
          </div>

          <div className="gq-card">
            {QUESTIONS.map((q) => {
              const given = result.answers[q.id];
              const correct = given === q.answer;
              return (
                <div className="gq-review-item" key={q.id}>
                  <div className="gq-review-q">{q.text}</div>
                  <div className={`gq-review-a ${correct ? "gq-ok" : "gq-bad"}`}>
                    <span>{correct ? "✓" : "✗"}</span>
                    <span>
                      {given}
                      {!correct && ` — correct answer: ${q.answer}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="gq-actions">
            <button type="button" className="gq-submit" onClick={reset}>
              Submit another response
            </button>
            <button type="button" className="gq-linkbtn" onClick={() => navigate("/")}>
              Back to site
            </button>
          </div>

          <p className="gq-footer">
            This content is neither created nor endorsed by Google.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="gq-page">
      <div className="gq-shell">
        <div className="gq-card gq-card-head">
          <h1 className="gq-title">General Knowledge Quiz</h1>
          <p className="gq-desc">
            10 quick questions. Choose one answer for each — your score appears as soon as you
            submit.
          </p>
          <div className="gq-signed-in">
            Signed in as <strong>{user}</strong>
          </div>
          <p className="gq-required-note">* Indicates required question</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {QUESTIONS.map((q, index) => {
            const isMissing = missing.includes(q.id);
            return (
              <div
                key={q.id}
                ref={(el) => {
                  cardRefs.current[q.id] = el;
                }}
                className={`gq-card ${isMissing ? "gq-card-error" : ""}`}
                role="radiogroup"
                aria-labelledby={`${q.id}-label`}
              >
                <span className="gq-q-label" id={`${q.id}-label`}>
                  {index + 1}. {q.text}
                  <span className="gq-star">*</span>
                </span>

                {q.options.map((option) => (
                  <label className="gq-option" key={option}>
                    <input
                      type="radio"
                      name={q.id}
                      value={option}
                      checked={answers[q.id] === option}
                      onChange={() => select(q.id, option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}

                {isMissing && (
                  <div className="gq-error" role="alert">
                    <span aria-hidden="true">⚠</span> This is a required question
                  </div>
                )}
              </div>
            );
          })}

          <div className="gq-actions">
            <button type="submit" className="gq-submit">
              Submit
            </button>
            <button type="button" className="gq-linkbtn" onClick={reset}>
              Clear form
            </button>
          </div>
        </form>

        <p className="gq-progress">Page 1 of 1</p>
        <p className="gq-footer">
          Never submit passwords through this form.
          <br />
          This content is neither created nor endorsed by Google.
        </p>
      </div>
    </div>
  );
}

export default Quiz;
