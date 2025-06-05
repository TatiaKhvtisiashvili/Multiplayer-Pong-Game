import { GameEngine } from './GameEngine';
import { GameState, PlayerInput } from './types';
import { GAME_CONFIG } from '../utils/constants';

export class GameRoom {
  private roomId: string;
  private player1Id: string;
  private player2Id: string;
  private gameEngine: GameEngine;
  private gameLoop: NodeJS.Timeout | null = null;
  private onGameUpdate: ((gameState: GameState) => void) | null = null;

  constructor(roomId: string, player1Id: string, player2Id: string) {
    this.roomId = roomId;
    this.player1Id = player1Id;
    this.player2Id = player2Id;
    this.gameEngine = new GameEngine(player1Id, player2Id);
  }

  public startGame(onGameUpdate: (gameState: GameState) => void): void {
    this.onGameUpdate = onGameUpdate;
    
    // Start the game loop
    this.gameLoop = setInterval(() => {
      const gameState = this.gameEngine.update();
      
      if (this.onGameUpdate) {
        this.onGameUpdate(gameState);
      }
      
      // Stop game loop if game is finished
      if (this.gameEngine.isGameFinished()) {
        this.stopGame();
      }
    }, 1000 / GAME_CONFIG.tickRate);
  }

  public stopGame(): void {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
  }

  public handlePlayerInput(playerId: string, input: PlayerInput): void {
    if (this.hasPlayer(playerId)) {
      this.gameEngine.handlePlayerInput(playerId, input);
    }
  }

  public hasPlayer(playerId: string): boolean {
    return playerId === this.player1Id || playerId === this.player2Id;
  }

  public getGameState(): GameState {
    return this.gameEngine.getGameState();
  }

  public getRoomId(): string {
    return this.roomId;
  }

  public getPlayers(): { player1: string; player2: string } {
    return {
      player1: this.player1Id,
      player2: this.player2Id
    };
  }

  public isGameFinished(): boolean {
    return this.gameEngine.isGameFinished();
  }

  public getWinner(): string | null {
    return this.gameEngine.getWinner();
  }
}