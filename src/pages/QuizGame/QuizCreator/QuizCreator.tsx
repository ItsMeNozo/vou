import React, { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext"; // Assuming you have a SocketContext set up

const QuizGameQuizCreator: React.FC = () => {
  const socket = useSocket();
  const [questionNum, setQuestionNum] = useState(1);
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([
    {
      question: "",
      answers: ["", "", "", ""],
      correct: 1,
    },
  ]);

  useEffect(() => {
    setBGColor();
  }, []);

  const updateDatabase = () => {
    const quiz = { id: 0, name: quizTitle, questions };
    if (socket) {
      socket.emit("newQuiz", quiz);
    }
  };

  const addQuestion = () => {
    setQuestionNum(questionNum + 1);
    setQuestions([
      ...questions,
      { question: "", answers: ["", "", "", ""], correct: 1 },
    ]);
  };

  const updateQuestion = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const updatedQuestions = questions.map((q, i) => {
      if (i === index) {
        if (field === "question") q.question = value as string;
        else if (field.startsWith("answer"))
          q.answers[parseInt(field.replace("answer", "")) - 1] =
            value as string;
        else if (field === "correct") q.correct = value as number;
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const cancelQuiz = () => {
    if (confirm("Are you sure you want to exit? All work will be DELETED!")) {
      window.location.href = "../";
    }
  };

  if (socket) {
    socket.on("startGameFromCreator", (data: string) => {
      window.location.href = `../../host/?id=${data}`;
    });
  }

  const randomColor = () => {
    const colors = ["#4CAF50", "#f94a1e", "#3399ff", "#ff9933"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const setBGColor = () => {
    const randColor = randomColor();
    document.getElementById("question-field")!.style.backgroundColor =
      randColor;
  };

  return (
    <div className="p-8">
      <h1 id="title" className="text-center font-raleway text-3xl mb-8">
        Kahoot Quiz Creator Studio
      </h1>
      <div className="form-field mb-4">
        <label id="quizTitle" className="font-raleway">
          Quiz Title
        </label>
        <input
          id="name"
          type="text"
          name="name"
          className="w-full mt-2 p-2 border rounded"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          autoFocus
        />
      </div>
      <div id="allQuestions">
        {questions.map((question, index) => (
          <div key={index} id="question-field" className="border p-4 mb-4">
            <label className="block font-raleway mb-2">
              Question {index + 1}:
            </label>
            <input
              className="question w-full p-2 border rounded mb-4"
              id={`q${index + 1}`}
              type="text"
              value={question.question}
              onChange={(e) =>
                updateQuestion(index, "question", e.target.value)
              }
              autoFocus
            />
            <label className="block font-raleway mb-2">Answer 1:</label>
            <input
              className="w-full p-2 border rounded mb-4"
              id={`${index + 1}a1`}
              type="text"
              value={question.answers[0]}
              onChange={(e) => updateQuestion(index, "answer1", e.target.value)}
              autoFocus
            />
            <label className="block font-raleway mb-2">Answer 2:</label>
            <input
              className="w-full p-2 border rounded mb-4"
              id={`${index + 1}a2`}
              type="text"
              value={question.answers[1]}
              onChange={(e) => updateQuestion(index, "answer2", e.target.value)}
              autoFocus
            />
            <label className="block font-raleway mb-2">Answer 3:</label>
            <input
              className="w-full p-2 border rounded mb-4"
              id={`${index + 1}a3`}
              type="text"
              value={question.answers[2]}
              onChange={(e) => updateQuestion(index, "answer3", e.target.value)}
              autoFocus
            />
            <label className="block font-raleway mb-2">Answer 4:</label>
            <input
              className="w-full p-2 border rounded mb-4"
              id={`${index + 1}a4`}
              type="text"
              value={question.answers[3]}
              onChange={(e) => updateQuestion(index, "answer4", e.target.value)}
              autoFocus
            />
            <label className="block font-raleway mb-2">
              Correct Answer (1-4):
            </label>
            <input
              className="correct w-16 p-2 border rounded text-center mb-4"
              id={`correct${index + 1}`}
              type="number"
              value={question.correct}
              onChange={(e) =>
                updateQuestion(index, "correct", parseInt(e.target.value))
              }
              autoFocus
            />
          </div>
        ))}
      </div>
      <button
        onClick={addQuestion}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Add another question
      </button>
      <div className="form-field mt-8">
        <button
          onClick={updateDatabase}
          className="bg-green-500 text-white p-2 rounded"
        >
          Create Quiz
        </button>
      </div>
      <button
        onClick={cancelQuiz}
        className="bg-red-500 text-white p-2 rounded mt-4"
      >
        Cancel quiz and return to quiz selection
      </button>
    </div>
  );
};

export default QuizGameQuizCreator;
