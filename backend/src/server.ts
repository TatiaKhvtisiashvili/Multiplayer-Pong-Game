import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { GameRoom } from './game/GameRoom';
import { GameState, PlayerInput } from './game/types';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store active game rooms
const gameRooms = new Map<string, GameRoom>();
let waitingPlayer: string | null = null;

app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

io.on('connection', (socket) => {
  console.log(`Player ${socket.id} connected`);

  socket.on('join-game', () => {
    if (waitingPlayer && waitingPlayer !== socket.id) {
      // Create a new game room with two players
      const roomId = `room-${Date.now()}`;
      const gameRoom = new GameRoom(roomId, waitingPlayer, socket.id);
      
      gameRooms.set(roomId, gameRoom);
      
      // Add both players to the room
      const waitingSocket = io.sockets.sockets.get(waitingPlayer);
      if (waitingSocket) {
        waitingSocket.join(roomId);
        socket.join(roomId);
        
        // Notify players that game is starting
        io.to(roomId).emit('game-start', {
          roomId,
          player1: waitingPlayer,
          player2: socket.id,
          gameState: gameRoom.getGameState()
        });
        
        // Start the game loop
        gameRoom.startGame((gameState: GameState) => {
          io.to(roomId).emit('game-update', gameState);
        });
        
        waitingPlayer = null;
      }
    } else {
      // Put player in waiting queue
      waitingPlayer = socket.id;
      socket.emit('waiting-for-player');
    }
  });

  socket.on('player-input', (input: PlayerInput) => {
    // Find the room this player is in
    for (const [roomId, gameRoom] of gameRooms) {
      if (gameRoom.hasPlayer(socket.id)) {
        gameRoom.handlePlayerInput(socket.id, input);
        break;
      }
    }
  });

  socket.on('disconnect', () => {
    console.log(`Player ${socket.id} disconnected`);
    
    // Remove from waiting queue
    if (waitingPlayer === socket.id) {
      waitingPlayer = null;
    }
    
    // Handle disconnection in active games
    for (const [roomId, gameRoom] of gameRooms) {
      if (gameRoom.hasPlayer(socket.id)) {
        gameRoom.stopGame();
        io.to(roomId).emit('player-disconnected');
        gameRooms.delete(roomId);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🏓 Ping Pong Server running on port ${PORT}`);
  console.log(`🌐 Frontend should connect to: http://localhost:${PORT}`);
});