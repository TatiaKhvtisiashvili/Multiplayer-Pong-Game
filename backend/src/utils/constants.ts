import { GameConfig } from '../game/types';

export const GAME_CONFIG: GameConfig = {
  canvasWidth: 800,
  canvasHeight: 400,
  paddleWidth: 10,
  paddleHeight: 90,
  paddleSpeed: 10,
  ballRadius: 10,
  ballSpeed: 4,
  winningScore: 5,
  tickRate: 60 
};

export const PADDLE_MARGIN = 30; 