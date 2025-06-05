import React from 'react';
import { useSocket } from './parts/useSocket';
import { WaitingRoom } from './parts/components/WaitingRoom';
import { Game } from './parts/components/Game';
import './App.css';

function App() {
  const {
    connectionStatus,
    gameState,
    isWaiting,
    gameStarted,
    joinGame,
    sendPlayerInput
  } = useSocket();

  const handlePlayerInput = (direction: 'up' | 'down' | 'stop') => {
    sendPlayerInput({
      type: 'paddle-move',
      direction
    });
  };

  return (
    <div className="App">
      {!gameStarted ? (
        <WaitingRoom
          onJoinGame={joinGame}
          isWaiting={isWaiting}
          connected={connectionStatus.connected}
        />
      ) : (
        gameState && connectionStatus.playerNumber && (
          <Game
            gameState={gameState}
            playerNumber={connectionStatus.playerNumber}
            onPlayerInput={handlePlayerInput}
          />
        )
      )}
    </div>
  );
}

export default App;