import React, { useEffect, useState } from "react";
import { useSocket } from "@/contexts/SocketContext";

interface PlayerData {
  gameData: {
    answer: number;
  };
}

interface Winners {
  num1: string;
  num2: string;
  num3: string;
  num4: string;
  num5: string;
}

const QuizGameHost: React.FC = () => {
  const [question, setQuestion] = useState<string>("");
  const [answers, setAnswers] = useState<
    { text: string; style: React.CSSProperties }[]
  >([
    { text: "", style: {} },
    { text: "", style: {} },
    { text: "", style: {} },
    { text: "", style: {} },
  ]);

  const [playersAnswered, setPlayersAnswered] = useState<string>("");
  const [time, setTime] = useState<number>(20);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winners, setWinners] = useState<Winners | null>(null);
  const [answerStats, setAnswerStats] = useState<{
    answer1: number;
    answer2: number;
    answer3: number;
    answer4: number;
  }>({ answer1: 0, answer2: 0, answer3: 0, answer4: 0 });
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.emit(
        "host-join-game",
        Object.fromEntries(new URLSearchParams(window.location.search)),
      );

      socket.on("noGameFound", () => {
        window.location.href = "/quiz-game";
      });

      socket.on(
        "gameQuestions",
        (data: {
          q1: string;
          a1: string;
          a2: string;
          a3: string;
          a4: string;
          correct: number;
          playersInGame: number;
        }) => {
          setQuestion(data.q1);
          setAnswers([
            { text: data.a1, style: {} },
            { text: data.a2, style: {} },
            { text: data.a3, style: {} },
            { text: data.a4, style: {} },
          ]);
          setPlayersAnswered(`Players Answered 0/${data.playersInGame}`);
          updateTimer();
        },
      );

      socket.on(
        "updatePlayersAnswered",
        (data: { playersAnswered: number; playersInGame: number }) => {
          setPlayersAnswered(
            `Players Answered ${data.playersAnswered}/${data.playersInGame}`,
          );
        },
      );

      socket.on("questionOver", (playerData: PlayerData[], correct: number) => {
        clearInterval(time);
        handleQuestionOver(playerData, correct);
      });

      socket.on(
        "GameOver",
        (data: {
          num1: string;
          num2: string;
          num3: string;
          num4: string;
          num5: string;
        }) => {
          setGameOver(true);
          setWinners(data);
        },
      );

      socket.on("getTime", (player: string) => {
        socket.emit("time", { player, time });
      });
    }
  }, [socket]);

  const updateTimer = () => {
    setTime(20);
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timer);
          if (socket) {
            socket.emit("timeUp");
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const handleQuestionOver = (playerData: PlayerData[], correct: number) => {
    let answer1 = 0;
    let answer2 = 0;
    let answer3 = 0;
    let answer4 = 0;
    let total = 0;

    // Hide elements on page
    setPlayersAnswered("");
    setTime(0);

    // Shows user correct answer with effects on elements
    const updatedAnswers = answers.map((answer, index) => {
      if (index + 1 !== correct) {
        return { ...answer, filter: "grayscale(50%)" };
      }
      return { ...answer, content: `✔ ${answer}` };
    });
    setAnswers(updatedAnswers);

    for (let i = 0; i < playerData.length; i++) {
      if (playerData[i].gameData.answer === 1) {
        answer1 += 1;
      } else if (playerData[i].gameData.answer === 2) {
        answer2 += 1;
      } else if (playerData[i].gameData.answer === 3) {
        answer3 += 1;
      } else if (playerData[i].gameData.answer === 4) {
        answer4 += 1;
      }
      total += 1;
    }

    // Gets values for graph
    answer1 = (answer1 / total) * 100;
    answer2 = (answer2 / total) * 100;
    answer3 = (answer3 / total) * 100;
    answer4 = (answer4 / total) * 100;

    setAnswerStats({ answer1, answer2, answer3, answer4 });
  };

  const nextQuestion = () => {
    if (socket) {
      socket.emit("nextQuestion");
    }
  };

  return (
    <div className="container mx-auto p-4 text-center animate-bgcolor">
      <h4 id="questionNum">Question 1/x</h4>
      <h4 id="playersAnswered">{playersAnswered}</h4>
      <h3 id="timerText">
        Time Left: <span id="num">{time}</span>
      </h3>
      <div
        className="square"
        style={{ height: `${answerStats.answer1}px` }}
      ></div>
      <div
        className="square"
        style={{ height: `${answerStats.answer2}px` }}
      ></div>
      <div
        className="square"
        style={{ height: `${answerStats.answer3}px` }}
      ></div>
      <div
        className="square"
        style={{ height: `${answerStats.answer4}px` }}
      ></div>
      <h2 id="question">{question}</h2>
      {answers.map((answer, index) => (
        <h3
          key={index}
          style={answer.style}
          className={`p-4 m-2 ${index === 0 ? "bg-green-500" : index === 1 ? "bg-red-500" : index === 2 ? "bg-blue-500" : "bg-yellow-500"} text-white`}
        >
          {answer.text}
        </h3>
      ))}
      <button
        onClick={nextQuestion}
        id="nextQButton"
        className="bg-green-500 text-white px-4 py-2 rounded-md"
      >
        Next Question
      </button>
      {gameOver && winners && (
        <div>
          <h2 id="winnerTitle" className="text-2xl font-bold">
            Top 5 Players
          </h2>
          <h3 id="winner1" className="text-xl">
            1. {winners.num1}
          </h3>
          <h3 id="winner2" className="text-xl">
            2. {winners.num2}
          </h3>
          <h3 id="winner3" className="text-xl">
            3. {winners.num3}
          </h3>
          <h3 id="winner4" className="text-xl">
            4. {winners.num4}
          </h3>
          <h3 id="winner5" className="text-xl">
            5. {winners.num5}
          </h3>
        </div>
      )}
    </div>
  );
};

export default QuizGameHost;
