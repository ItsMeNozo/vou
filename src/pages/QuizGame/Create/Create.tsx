import React, { useEffect, useState } from "react";
import { useSocket } from "@/contexts/SocketContext";

interface Game {
  id: string;
  name: string;
}

const QuizGameCreate: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.emit("requestDbNames");
      socket.on("gameNamesData", (data: Game[]) => {
        setGames(data);
      });
    }
  }, [socket]);

  const startGame = (id: string) => {
    window.location.href = `/quiz-game/host/?id=${id}`;
  };

  return (
    <div className="container mx-auto p-4 animate-bgcolor">
      <a href="../" className="text-white">
        Back
      </a>
      <h1 className="text-3xl font-bold text-center text-white">
        Start a Kahoot Game
      </h1>
      <h4 className="text-xl text-center text-white">
        Choose a Game Below or{" "}
        <a href="quiz-creator/" className="text-white underline">
          Create your Own!
        </a>
      </h4>
      <div id="game-list" className="text-center">
        {games.map((game) => (
          <div key={game.id}>
            <button
              onClick={() => startGame(game.id)}
              className="text-2xl font-bold text-white hover:underline"
            >
              {game.name}
            </button>
            <br />
            <br />
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizGameCreate;
