import React, { useEffect, useState } from "react";
import axios from "axios";

import defaultAvatar from "@/assets/avatar.png";

// Access the API Gateway URL from environment variables
const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL;

if (!API_GATEWAY_URL) {
  throw new Error("API_GATEWAY_URL is not defined in environment variables");
}
interface Player {
  uid: string;
  avatar: string;
  username: string;
  score: number;
}

interface TopPlayer {
  id: string;
  score: number;
}

interface LeaderboardProps {
  topPlayers: TopPlayer[];
}

// const mockPlayers: Player[] = [
//   { id: "1", avatar: "", name: "Player One", score: 100 },
//   { id: "2", avatar: "", name: "Player Two", score: 90 },
//   { id: "3", avatar: "", name: "Player Three", score: 80 },
//   { id: "4", avatar: "", name: "Player Four", score: 70 },
//   { id: "5", avatar: "", name: "Player Five", score: 60 },
// ];

const Leaderboard: React.FC<LeaderboardProps> = ({ topPlayers }) => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const playerDataPromises = topPlayers.map(async (topPlayer) => {
          const response = await axios.get(
            `${API_GATEWAY_URL}/api/user/${topPlayer.id}`,
          );
          const { uid, avatar, username } = response.data.data;
          return { uid, avatar, username, score: topPlayer.score };
        });
        const playerData = await Promise.all(playerDataPromises);
        setPlayers(playerData);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };
    fetchPlayers();
    // setPlayers(mockPlayers);
  }, [topPlayers]);

  return (
    <div className="leaderboard z-10 w-full">
      <h2 className="text-2xl mb-4">Leaderboard</h2>
      <div className="flex flex-col gap-1">
        {players
          .sort((a, b) => b.score - a.score)
          .map((player) => (
            <div className="flex items-center justify-between w-full py-2 px-4 bg-slate-100 rounded-md">
              <div className="flex items-center gap-2">
                <img
                  src={player.avatar ? player.avatar : defaultAvatar}
                  alt="User Avatar"
                  className="h-10 w-10 rounded-full"
                />
                <div className="">{player.username}</div>
              </div>
              <div className="">{player.score}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Leaderboard;
