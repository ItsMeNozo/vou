// src/utils/socketClient.ts
import { io, Socket } from 'socket.io-client';
import { getGatewayUrl } from '@/utils/UrlUtils';

let socket: Socket | null = null;

const API_GATEWAY_URL = getGatewayUrl();

export const initializeSocket = (username: string) => {
  // Connect to the WebSocket server
  socket = io(API_GATEWAY_URL, {
    path: '/noti-socket-server',
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('Connected to WebSocket server', socket?.id);
    socket?.emit('register', username+'@vouFE'); // Register user on the WebSocket server
  });

  socket.on('notification', (notification: any) => {
    console.log('New notification received:', notification);
    // Handle incoming notifications (e.g., show notification in the UI)
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
  });
};

export const sendMessage = (event: string, data: any) => {
  if (socket) {
    socket.emit(event, data);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
