import React, { useRef, useEffect } from 'react';
import { GameState } from '../game';
import { GAME_CONFIG, COLORS } from '../constants';

interface GameBoardProps {
  gameState: GameState;
  playerNumber: 1 | 2;
}

export const GameBoard: React.FC<GameBoardProps> = ({ gameState, playerNumber }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight);

    ctx.strokeStyle = COLORS.centerLine;
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(GAME_CONFIG.canvasWidth / 2, 0);
    ctx.lineTo(GAME_CONFIG.canvasWidth / 2, GAME_CONFIG.canvasHeight);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = COLORS.paddle;
    
    ctx.fillRect(
      gameState.player1Paddle.x,
      gameState.player1Paddle.y,
      gameState.player1Paddle.width,
      gameState.player1Paddle.height
    );

    ctx.fillRect(
      gameState.player2Paddle.x,
      gameState.player2Paddle.y,
      gameState.player2Paddle.width,
      gameState.player2Paddle.height
    );

    ctx.fillStyle = COLORS.ball;
    ctx.beginPath();
    ctx.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, Math.PI * 2);
    ctx.fill();

  }, [gameState]);

  return (
    <div className="game-board">
      <canvas
        ref={canvasRef}
        width={GAME_CONFIG.canvasWidth}
        height={GAME_CONFIG.canvasHeight}
        style={{
          border: '2px solid #f3ff5f',
          backgroundColor: COLORS.background,
          display: 'block',
          margin: '0 auto'
        }}
      />
      <div className="player-indicator" style={{
        textAlign: 'center',
        color: 'white',
        marginTop: '10px',
        fontSize: '14px'
      }}>
        You are Player {playerNumber} ({playerNumber === 1 ? 'Left' : 'Right'} Paddle)
      </div>
    </div>
  );
};