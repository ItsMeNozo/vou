import React, { useEffect, useState } from "react";
import { useSocket } from "@/contexts/SocketContext";

const Host: React.FC = () => {
  const [gamePin, setGamePin] = useState<string>("");
  const [players, setPlayers] = useState<string[]>([]);
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.emit(
        "host-join",
        Object.fromEntries(new URLSearchParams(window.location.search))
      );

      socket.on("showGamePin", (data: { pin: string }) => {
        setGamePin(data.pin);
      });

      socket.on("updatePlayerLobby", (data: { name: string }[]) => {
        setPlayers(data.map((player) => player.name));
      });

      socket.on("gameStarted", (id: string) => {
        window.location.href = `/quiz-game/host/game/?id=${id}`;
      });

      socket.on("noGameFound", () => {
        window.location.href = "../../";
      });
    }
  }, [socket]);

  const startGame = () => {
    if (socket) {
      socket.emit("startGame");
    }
  };

  const endGame = () => {
    window.location.href = "/";
  };

  return (
    <div className="container mx-auto p-4 text-center animate-bgcolor">
      <button
        onClick={endGame}
        className="bg-red-500 text-white px-4 py-2 rounded-md"
      >
        Cancel Game
      </button>
      <h2 className="text-2xl font-bold text-white">
        Join this Game using the Game Pin:
      </h2>
      <h1 className="text-4xl font-bold text-white">{gamePin}</h1>
      <textarea
        readOnly
        value={players.join("\n")}
        className="block mx-auto text-center text-lg resize-none w-96 h-64 mt-4"
      />
      <br />
      <button
        onClick={startGame}
        className="bg-green-500 text-white px-4 py-2 rounded-md"
      >
        Start Game
      </button>
    </div>
  );
};

export default Host;
