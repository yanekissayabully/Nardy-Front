// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import io, { Socket } from 'socket.io-client';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// interface MultiplayerState {
//   socket: Socket | null;
//   roomId: string | null;
//   myColor: 'white' | 'black' | null;
//   opponentId: string | null;
//   isConnected: boolean;
//   isGameStarted: boolean;
//   currentTurn: 'white' | 'black' | null;
// }

// export function useMultiplayer() {
//   const [state, setState] = useState<MultiplayerState>({
//     socket: null,
//     roomId: null,
//     myColor: null,
//     opponentId: null,
//     isConnected: false,
//     isGameStarted: false,
//     currentTurn: null,
//   });

//   const connect = useCallback(() => {
//     const socket = io(API_URL, {
//       transports: ['websocket'],
//       reconnection: true,
//     });

//     socket.on('connect', () => {
//       setState(prev => ({ ...prev, socket, isConnected: true }));
//     });

//     socket.on('disconnect', () => {
//       setState(prev => ({ ...prev, isConnected: false }));
//     });

//     setState(prev => ({ ...prev, socket }));
//   }, []);

//   const createRoom = async (): Promise<string> => {
//     if (!state.socket) connect();
    
//     return new Promise((resolve) => {
//       state.socket?.emit('create-room', (data: { roomId: string }) => {
//         setState(prev => ({ ...prev, roomId: data.roomId }));
//         resolve(data.roomId);
//       });
//     });
//   };

//   const joinRoom = async (roomId: string, asColor?: 'white' | 'black'): Promise<boolean> => {
//     if (!state.socket) connect();

//     return new Promise((resolve) => {
//       state.socket?.emit('join-room', { roomId, asColor }, (data: { color: 'white' | 'black'; error?: string }) => {
//         if (data.error) {
//           console.error('Join room error:', data.error);
//           resolve(false);
//         } else {
//           setState(prev => ({ ...prev, roomId, myColor: data.color }));
//           resolve(true);
//         }
//       });
//     });
//   };

//   const sendMove = useCallback((move: any, gameState: any) => {
//     if (state.roomId && state.socket) {
//       state.socket.emit('move', {
//         roomId: state.roomId,
//         move,
//         gameState,
//       });
//     }
//   }, [state.roomId, state.socket]);

//   const onGameStart = useCallback((callback: (data: any) => void) => {
//     state.socket?.on('game-start', callback);
//     return () => { state.socket?.off('game-start', callback); };
//   }, [state.socket]);

//   const onOpponentMove = useCallback((callback: (data: any) => void) => {
//     state.socket?.on('opponent-move', callback);
//     return () => { state.socket?.off('opponent-move', callback); };
//   }, [state.socket]);

//   const onGameOver = useCallback((callback: (data: any) => void) => {
//     state.socket?.on('game-over', callback);
//     return () => { state.socket?.off('game-over', callback); };
//   }, [state.socket]);

//   const onOpponentDisconnected = useCallback((callback: () => void) => {
//     state.socket?.on('opponent-disconnected', callback);
//     return () => { state.socket?.off('opponent-disconnected', callback); };
//   }, [state.socket]);

//   const disconnect = useCallback(() => {
//     state.socket?.disconnect();
//     setState({
//       socket: null,
//       roomId: null,
//       myColor: null,
//       opponentId: null,
//       isConnected: false,
//       isGameStarted: false,
//       currentTurn: null,
//     });
//   }, [state.socket]);

//   useEffect(() => {
//     return () => {
//       state.socket?.disconnect();
//     };
//   }, [state.socket]);

//   return {
//     ...state,
//     connect,
//     createRoom,
//     joinRoom,
//     sendMove,
//     onGameStart,
//     onOpponentMove,
//     onGameOver,
//     onOpponentDisconnected,
//     disconnect,
//   };
// }


'use client';

import { useState, useRef, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useMultiplayer() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [myColor, setMyColor] = useState<'white' | 'black' | null>(null);
  const [opponentReady, setOpponentReady] = useState(false);

  const getSocket = useCallback((): Promise<Socket> => {
    return new Promise((resolve, reject) => {
      if (socketRef.current?.connected) {
        resolve(socketRef.current);
        return;
      }

      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      const socket = io(API_URL, {
        transports: ['websocket', 'polling'],
        reconnection: false,
        timeout: 5000,
      });

      socketRef.current = socket;

      socket.on('disconnect', () => setIsConnected(false));

      // ✅ Вешаем game-start ОДИН РАЗ здесь — работает и для создателя и для джойнера
      socket.on('game-start', () => setOpponentReady(true));

      socket.once('connect', () => {
        setIsConnected(true);
        resolve(socket);
      });

      socket.once('connect_error', reject);
    });
  }, []);

  const createRoom = async (): Promise<string> => {
    const socket = await getSocket();

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Server did not respond')), 5000);

      socket.emit('create-room', (data: { roomId: string; error?: string }) => {
        clearTimeout(timer);
        if (data?.error) {
          reject(new Error(data.error));
        } else {
          setRoomId(data.roomId);
          setMyColor('white');
          resolve(data.roomId);
        }
      });
    });
  };

  const joinRoom = async (code: string): Promise<'white' | 'black'> => {
    const socket = await getSocket();

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Server did not respond')), 5000);

      socket.emit(
        'join-room',
        { roomId: code },
        (data: { color: 'white' | 'black'; error?: string }) => {
          clearTimeout(timer);
          if (data?.error) {
            reject(new Error(data.error));
          } else {
            setRoomId(code);
            setMyColor(data.color);
            resolve(data.color);
          }
        }
      );
    });
  };

  const sendMove = useCallback((move: any, gameState: any) => {
    if (roomId && socketRef.current?.connected) {
      socketRef.current.emit('move', { roomId, move, gameState });
    }
  }, [roomId]);

  const onOpponentMove = useCallback((cb: (data: any) => void) => {
    socketRef.current?.on('opponent-move', cb);
    return () => { socketRef.current?.off('opponent-move', cb); };
  }, []);

  const onOpponentDisconnected = useCallback((cb: () => void) => {
    socketRef.current?.on('opponent-disconnected', cb);
    return () => { socketRef.current?.off('opponent-disconnected', cb); };
  }, []);

  const disconnect = useCallback(() => {
    socketRef.current?.removeAllListeners();
    socketRef.current?.disconnect();
    socketRef.current = null;
    setIsConnected(false);
    setRoomId(null);
    setMyColor(null);
    setOpponentReady(false);
  }, []);

  return {
    isConnected,
    roomId,
    myColor,
    opponentReady,
    createRoom,
    joinRoom,
    sendMove,
    onOpponentMove,
    onOpponentDisconnected,
    disconnect,
  };
}