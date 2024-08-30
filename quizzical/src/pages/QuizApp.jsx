import React from "react";
import Start from "../components/Start";
import Quiz from "../components/Quiz";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function QuizApp() {
  const { token, logout } = useAuth();
  const [start, setStart] = React.useState(false);
  const [quiz, setQuiz] = React.useState([]);
  const [count, setCount] = React.useState(0);
  const [correct, setCorrect] = React.useState(0);
  const [isRevealed, setIsRevealed] = React.useState(true);
  const [number, setNumber] = React.useState(5);
  const [category, setCategory] = React.useState("");
  const [difficulty, setDifficulty] = React.useState("");
  const navigate = useNavigate();

  function handleNumber(e) {
    setNumber(e.target.value);
  }

  function handleCategory(e) {
    setCategory(e.target.value);
  }

  function handleDifficulty(e) {
    setDifficulty(e.target.value);
  }

  function shuffleArray(arr) {
    return arr.sort(() => Math.random() - number / 10);
  }

  function startQuiz() {
    handleQuiz();
    setStart((preVal) => !preVal);
  }

  console.log(category);

  const handleQuiz = () => {
    fetch(
      `http://localhost:8080/api/questions?amount=${number}&category=${category}&difficulty=${difficulty}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        let q = [];
        data?.content.forEach((question) => {
          q.push({
            id: nanoid(),
            answers: shuffleArray([
              ...question.incorrectAnswers,
              question.correctAnswer,
            ]),
            question: question.question,
            correct: question.correctAnswer,
            selected: null,
            checked: false,
          });
        });
        setQuiz(q);
      });
  };

  function handleCheck() {
    let selected = true;
    quiz.forEach((question) => {
      if (question.selected === null) {
        selected = false;
        return;
      }
    });
    if (!selected) {
      window.alert("You must answer all questions!");
      return;
    }
    setQuiz((questions) =>
      questions.map((question) => {
        return { ...question, checked: true };
      })
    );
    let correct = 0;
    quiz.forEach((question) => {
      if (question.correct === question.selected) {
        correct += 1;
      }
      setCorrect(correct);
    });
    setIsRevealed(false);
    console.log(quiz);
  }

  function handleClickAnswer(id, answer) {
    setQuiz((questions) =>
      questions.map((question) => {
        return question.id === id
          ? { ...question, selected: answer }
          : question;
      })
    );
  }

  function handlePlayAgain() {
    setCount((count) => count + 1);
    setIsRevealed(true);
  }

  const questions = quiz.map((item) => {
    return (
      <Quiz
        key={item.id}
        id={item.id}
        q={item}
        handleClickAnswer={handleClickAnswer}
        abc={4}
      />
    );
  });

  return (
    <div>
      <img src="./images/blob1.png" className="blue-blob" />
      <img src="./images/blob2.png" className="green-blob" />
      {!start ? (
        <>
          <h2 className="admin-link" onClick={() => navigate("/admin")}>
            Go to admin page
          </h2>
          {token && (
            <h2 className="logout" onClick={logout}>
              Logout
            </h2>
          )}
          <Start
            start={startQuiz}
            handleNumber={handleNumber}
            handleCategory={handleCategory}
            handleDifficulty={handleDifficulty}
          />
        </>
      ) : (
        <>
          <h1 className="logout" onClick={() => window.location.reload()}>
            Quizzical
          </h1>
          {questions}
        </>
      )}
      {start && (
        <div className="end">
          {isRevealed ? (
            <div className="check" onClick={handleCheck}>
              Check answers
            </div>
          ) : (
            <div className="results">
              <span className="score">
                You scored {correct}/{number} correct answers
              </span>
              <div className="again" onClick={handlePlayAgain}>
                Play Again
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
