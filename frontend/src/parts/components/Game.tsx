import React, { useEffect, useCallback } from 'react';
import { GameBoard } from './GameBoard';
import { ScoreBoard } from './ScoreBoard';
import { GameState } from '../game';

interface GameProps {
  gameState: GameState;
  playerNumber: 1 | 2;
  onPlayerInput: (direction: 'up' | 'down' | 'stop') => void;
}

export const Game: React.FC<GameProps> = ({ gameState, playerNumber, onPlayerInput }) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        onPlayerInput('up');
        break;
      case 'ArrowDown':
        event.preventDefault();
        onPlayerInput('down');
        break;
    }
  }, [onPlayerInput]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      onPlayerInput('stop');
    }
  }, [onPlayerInput]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <div className="game-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      borderRadius: '10px',
      padding: '10px',
      backgroundColor: '#0a0a0a',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h1 style={{ 
        fontSize: '28px', 
        marginBottom: '5px',
        color: '#f3ff5f',
        textAlign: 'center'
      }}>
        🏓 Multiplayer Ping Pong 🏓
      </h1>
      
      <ScoreBoard gameState={gameState} playerNumber={playerNumber} />
      
      <GameBoard gameState={gameState} playerNumber={playerNumber} />
      
      <div className="controls-info" style={{
        marginTop: '10px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#aaa',
        backgroundColor: '#1a1a1a',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #333'
      }}>
        <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#f3ff5f' }}>
          Controls
        </div>
        <div>↑ Move paddle up</div>
        <div>↓ Move paddle down</div>
      </div>

      {gameState.gameStatus === 'finished' && (
        <div style={{
          marginTop: '20px',
          padding: '20px',
          border: '1px solid #333',
          backgroundColor: '#1a1a1a',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '20px', marginBottom: '10px' }}>
            Game Complete!
          </div>
          <div style={{ fontSize: '14px', color: '#f3ff5f' }}>
            Refresh the page to play again
          </div>
        </div>
      )}
    </div>
  );
};