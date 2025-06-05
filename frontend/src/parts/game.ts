export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

export interface Ball {
  x: number;
  y: number;
  radius: number;
  velocity: Velocity;
  speed: number;
}

export interface GameState {
  ball: Ball;
  player1Paddle: Paddle;
  player2Paddle: Paddle;
  score: {
    player1: number;
    player2: number;
  };
  gameStatus: 'waiting' | 'playing' | 'paused' | 'finished';
  lastUpdate: number;
}

export interface PlayerInput {
  type: 'paddle-move';
  direction: 'up' | 'down' | 'stop';
  timestamp: number;
}

export interface GameRoomData {
  roomId: string;
  player1: string;
  player2: string;
  gameState: GameState;
}

export interface ConnectionStatus {
  connected: boolean;
  playerId?: string;
  roomId?: string;
  playerNumber?: 1 | 2;
}