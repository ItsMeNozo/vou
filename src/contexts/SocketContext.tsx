import { useContext } from "react";
import { SocketContext } from "@/providers/SocketProvider";

export const useSocket = () => {
  return useContext(SocketContext);
};
