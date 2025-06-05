import { GameState, Ball, Paddle, PlayerInput } from './types';
import { GAME_CONFIG, PADDLE_MARGIN } from '../utils/constants';

export class GameEngine {
  private gameState: GameState;
  private player1Id: string;
  private player2Id: string;

  constructor(player1Id: string, player2Id: string) {
    this.player1Id = player1Id;
    this.player2Id = player2Id;
    this.gameState = this.initializeGameState();
  }

  private initializeGameState(): GameState {
    const { canvasWidth, canvasHeight, paddleWidth, paddleHeight, paddleSpeed, ballRadius, ballSpeed } = GAME_CONFIG;
    
    return {
      ball: {
        x: canvasWidth / 2,
        y: canvasHeight / 2,
        radius: ballRadius,
        velocity: {
          x: Math.random() > 0.5 ? ballSpeed : -ballSpeed,
          y: (Math.random() - 0.5) * ballSpeed
        },
        speed: ballSpeed
      },
      player1Paddle: {
        x: PADDLE_MARGIN,
        y: canvasHeight / 2 - paddleHeight / 2,
        width: paddleWidth,
        height: paddleHeight,
        speed: paddleSpeed
      },
      player2Paddle: {
        x: canvasWidth - PADDLE_MARGIN - paddleWidth,
        y: canvasHeight / 2 - paddleHeight / 2,
        width: paddleWidth,
        height: paddleHeight,
        speed: paddleSpeed
      },
      score: {
        player1: 0,
        player2: 0
      },
      gameStatus: 'playing',
      lastUpdate: Date.now()
    };
  }

  public update(): GameState {
    if (this.gameState.gameStatus !== 'playing') {
      return this.gameState;
    }

    this.updateBall();
    this.checkCollisions();
    this.checkScore();
    
    this.gameState.lastUpdate = Date.now();
    return this.gameState;
  }

  private updateBall(): void {
    const { ball } = this.gameState;
    
    ball.x += ball.velocity.x;
    ball.y += ball.velocity.y;

    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= GAME_CONFIG.canvasHeight) {
      ball.velocity.y = -ball.velocity.y;
      ball.y = Math.max(ball.radius, Math.min(GAME_CONFIG.canvasHeight - ball.radius, ball.y));
    }
  }

  private checkCollisions(): void {
    const { ball, player1Paddle, player2Paddle } = this.gameState;

    // Check collision with player 1 paddle (left)
    if (this.ballPaddleCollision(ball, player1Paddle)) {
      ball.velocity.x = Math.abs(ball.velocity.x);
      this.addSpinToBall(ball, player1Paddle);
    }

    if (this.ballPaddleCollision(ball, player2Paddle)) {
      ball.velocity.x = -Math.abs(ball.velocity.x);
      this.addSpinToBall(ball, player2Paddle);
    }
  }

  private ballPaddleCollision(ball: Ball, paddle: Paddle): boolean {
    return (
      ball.x - ball.radius < paddle.x + paddle.width &&
      ball.x + ball.radius > paddle.x &&
      ball.y - ball.radius < paddle.y + paddle.height &&
      ball.y + ball.radius > paddle.y
    );
  }

  private addSpinToBall(ball: Ball, paddle: Paddle): void {
    const paddleCenter = paddle.y + paddle.height / 2;
    const hitPosition = (ball.y - paddleCenter) / (paddle.height / 2);
    
    ball.velocity.y += hitPosition * 2;
    
    const currentSpeed = Math.sqrt(ball.velocity.x ** 2 + ball.velocity.y ** 2);
    ball.velocity.x = (ball.velocity.x / currentSpeed) * ball.speed;
    ball.velocity.y = (ball.velocity.y / currentSpeed) * ball.speed;
  }

  private checkScore(): void {
    const { ball, score } = this.gameState;

    if (ball.x < 0) {
      score.player2++;
      this.resetBall();
    } else if (ball.x > GAME_CONFIG.canvasWidth) {
      score.player1++;
      this.resetBall();
    }

    if (score.player1 >= GAME_CONFIG.winningScore || score.player2 >= GAME_CONFIG.winningScore) {
      this.gameState.gameStatus = 'finished';
    }
  }

  private resetBall(): void {
    const { ball } = this.gameState;
    const { canvasWidth, canvasHeight, ballSpeed } = GAME_CONFIG;
    
    ball.x = canvasWidth / 2;
    ball.y = canvasHeight / 2;
    ball.velocity = {
      x: Math.random() > 0.5 ? ballSpeed : -ballSpeed,
      y: (Math.random() - 0.5) * ballSpeed
    };
  }

  public handlePlayerInput(playerId: string, input: PlayerInput): void {
    if (input.type !== 'paddle-move') return;

    const paddle = playerId === this.player1Id ? this.gameState.player1Paddle : this.gameState.player2Paddle;
    
    switch (input.direction) {
      case 'up':
        paddle.y = Math.max(0, paddle.y - paddle.speed);
        break;
      case 'down':
        paddle.y = Math.min(GAME_CONFIG.canvasHeight - paddle.height, paddle.y + paddle.speed);
        break;
      case 'stop':
        break;
    }
  }

  public getGameState(): GameState {
    return { ...this.gameState };
  }

  public isGameFinished(): boolean {
    return this.gameState.gameStatus === 'finished';
  }

  public getWinner(): string | null {
    if (!this.isGameFinished()) return null;
    
    const { score } = this.gameState;
    return score.player1 > score.player2 ? this.player1Id : this.player2Id;
  }
}