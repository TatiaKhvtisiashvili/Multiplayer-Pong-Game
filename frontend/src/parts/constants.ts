export const GAME_CONFIG = {
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

export const COLORS = {
  background: '#000000',
  paddle: '#f3ff5f',
  ball: '#f3ff5f',
  text: '#f3ff5f',
  centerLine: '#f3ff5f'
};

export const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001';