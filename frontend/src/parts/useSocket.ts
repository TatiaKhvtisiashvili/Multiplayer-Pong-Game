import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameState, PlayerInput, GameRoomData, ConnectionStatus } from './game';
import { SERVER_URL } from './constants';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false
  });
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    socketRef.current = io(SERVER_URL);
    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to server');
      setConnectionStatus({
        connected: true,
        playerId: socket.id
      });
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnectionStatus({ connected: false });
      setGameStarted(false);
      setIsWaiting(false);
      setGameState(null);
    });

    socket.on('waiting-for-player', () => {
      console.log('Waiting for another player...');
      setIsWaiting(true);
    });

    socket.on('game-start', (data: GameRoomData) => {
      console.log('Game starting!', data);
      setIsWaiting(false);
      setGameStarted(true);
      setGameState(data.gameState);
      
      const playerNumber = data.player1 === socket.id ? 1 : 2;
      setConnectionStatus(prev => ({
        ...prev,
        roomId: data.roomId,
        playerNumber
      }));
    });

    socket.on('game-update', (newGameState: GameState) => {
      setGameState(newGameState);
    });

    socket.on('player-disconnected', () => {
      console.log('Other player disconnected');
      setGameStarted(false);
      setGameState(null);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinGame = () => {
    if (socketRef.current) {
      socketRef.current.emit('join-game');
    }
  };

  const sendPlayerInput = (input: Omit<PlayerInput, 'timestamp'>) => {
    if (socketRef.current && gameStarted) {
      const fullInput: PlayerInput = {
        ...input,
        timestamp: Date.now()
      };
      socketRef.current.emit('player-input', fullInput);
    }
  };

  return {
    connectionStatus,
    gameState,
    isWaiting,
    gameStarted,
    joinGame,
    sendPlayerInput
  };
};