import React, { useEffect, useState } from "react";
import { useSocket } from "@/contexts/SocketContext"; 
import { useSearchParams } from "react-router-dom";

interface PlayerData {
  playerId: string;
  name: string;
  gameData: {
    score: number;
  };
}

const QuizGamePlayerGameView: React.FC = () => {
  const socket = useSocket();
  const [searchParams] = useSearchParams();
  const [playerAnswered, setPlayerAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [name, setName] = useState("");
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [questionOver, setQuestionOver] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const params = Object.fromEntries([...searchParams]);
    socket.emit("player-join-game", params);

    socket.on("noGameFound", () => {
      window.location.href = "/quiz-game";
    });

    socket.on("answerResult", (data: boolean) => {
      setCorrect(data);
    });

    socket.on("questionOver", () => {
      socket.emit("getScore");
    });

    socket.on("newScore", (data: number) => {
      setScore(data);
      setQuestionOver(true);
    });

    socket.on("nextQuestionPlayer", () => {
      setCorrect(false);
      setPlayerAnswered(false);
      setButtonVisibility(true);
      setMessage("");
      document.body.style.backgroundColor = "white";
    });

    socket.on("hostDisconnect", () => {
      window.location.href = "/quiz-game";
    });

    socket.on("playerGameData", (data: PlayerData[]) => {
      const player = data.find((player) => player.playerId === socket.id);
      if (player) {
        setName(player.name);
        setScore(player.gameData.score);
      }
    });

    socket.on("GameOver", () => {
      document.body.style.backgroundColor = "#FFFFFF";
      setButtonVisibility(false);
      setMessage("GAME OVER");
    });

    return () => {
      socket.off("noGameFound");
      socket.off("answerResult");
      socket.off("questionOver");
      socket.off("newScore");
      socket.off("nextQuestionPlayer");
      socket.off("hostDisconnect");
      socket.off("playerGameData");
      socket.off("GameOver");
    };
  }, [socket]);

  useEffect(() => {
    if (!message) return;
    setButtonVisibility(false);

    if (correct) {
      document.body.style.backgroundColor = "#4CAF50";
      setMessage("Correct!");
    } else {
      document.body.style.backgroundColor = "#f94a1e";
      setMessage("Incorrect!");
    }
  }, [questionOver]);

  const setButtonVisibility = (visible: boolean) => {
    const visibility = visible ? "visible" : "hidden";
    for (let i = 1; i <= 4; i++) {
      document.getElementById(`answer${i}`)!.style.visibility = visibility;
    }
  };

  const answerSubmitted = (num: number) => {
    if (!playerAnswered) {
      setPlayerAnswered(true);
      if (socket) {
        socket.emit("playerAnswer", num);
      }
      setButtonVisibility(false);
      setMessage("Answer Submitted! Waiting on other players...");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div id="stats" className="flex space-x-4 mb-4">
        <h4 id="nameText" className="">
          Name: {name}
        </h4>
        <h4 id="scoreText" className="">
          Score: {score}
        </h4>
        <h4 id="rankText" className=""></h4>
      </div>
      <h2 id="message" className=" text-center text-2xl mb-8">
        {message}
      </h2>
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        {[1, 2, 3, 4].map((num) => (
          <button
            key={num}
            onClick={() => answerSubmitted(num)}
            id={`answer${num}`}
            className={`button w-full h-32 bg-${num === 1 ? "green-500" : num === 2 ? "red-500" : num === 3 ? "blue-500" : "yellow-500"} text-white rounded-md`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default QuizGamePlayerGameView;
