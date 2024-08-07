import React from "react";
import defaultAvatar from "@/assets/avatar.png";

interface PlayerData {
  playerId: string;
  avatar: string;
  name: string;
  gameData: {
    score: number;
  };
}

interface LeaderboardProps {
  players: PlayerData[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players }) => {
  return (
    <div className="leaderboard z-10 w-full">
      <h2 className="text-2xl mb-4">Leaderboard</h2>
      <div className="flex flex-col gap-1">
        {players
          .sort((a, b) => b.gameData.score - a.gameData.score)
          .map((player, index) => (
            <div className="flex items-center justify-between w-full py-2 px-4 bg-slate-100 rounded-md">
              <div className="flex items-center gap-2">
                <img
                  src={player.avatar ? player.avatar : defaultAvatar}
                  alt="User Avatar"
                  className="h-10 w-10 rounded-full"
                />
                <div className="">{player.name}</div>
              </div>
              <div className="">{player.gameData.score}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Leaderboard;
