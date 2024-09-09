import React, { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const QUIZ_GAME_PORT = import.meta.env.VITE_QUIZ_GAME_PORT;

export const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(`http://localhost:${QUIZ_GAME_PORT}`);
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
