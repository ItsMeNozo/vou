import React, { useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";
import "./Lobby.css";

const QuizGameLobby: React.FC = () => {
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.emit(
        "player-join",
        Object.fromEntries(new URLSearchParams(window.location.search)),
      );

      socket.on("noGameFound", () => {
        window.location.href = "../";
      });

      socket.on("hostDisconnect", () => {
        window.location.href = "../";
      });

      socket.on("gameStartedPlayer", () => {
        window.location.href = `/quiz-game/player/game/?id=${socket.id}`;
      });
    }
  }, [socket]);

  return (
    <div className="container mx-auto p-4 text-center animate-bgcolor">
      <h1 id="title1" className="text-white ">
        Waiting on host to start game
      </h1>
      <h3 id="title2" className="text-white  text-sm">
        Do you see your name on the screen?
      </h3>
      <div className="loader mx-auto my-4"></div>
    </div>
  );
};

export default QuizGameLobby;
