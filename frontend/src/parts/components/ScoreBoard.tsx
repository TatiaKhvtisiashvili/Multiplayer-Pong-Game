import React from 'react';
import { GameState } from '../game';
import { GAME_CONFIG } from '../constants';

interface ScoreBoardProps {
  gameState: GameState;
  playerNumber: 1 | 2;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ gameState, playerNumber }) => {
  const { score, gameStatus } = gameState;
  
  const isGameFinished = gameStatus === 'finished';
  const winner = isGameFinished 
    ? (score.player1 > score.player2 ? 1 : 2)
    : null;
  
  const isWinner = winner === playerNumber;
  
  return (
    <div className="scoreboard" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px',
      backgroundColor: '#1a1a1a',
      border: '2px solid #333',
      borderRadius: '10px',
      margin: '10px 0',
      color: 'white',
      fontFamily: 'monospace',
      fontSize: '24px'
    }}>
      <div className="player1-score" style={{
        textAlign: 'center',
        flex: 1,
        backgroundColor: playerNumber === 1 ? '#4a4a4a' : 'transparent',
        padding: '10px',
        borderRadius: '5px'
      }}>
        <div style={{ fontSize: '16px', marginBottom: '5px' }}>
          Player 1 {playerNumber === 1 && '(You)'}
        </div>
        <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
          {score.player1}
        </div>
      </div>
      
      <div className="game-status" style={{
        textAlign: 'center',
        flex: 1,
        padding: '0 20px'
      }}>
        {isGameFinished ? (
          <div>
            <div style={{ fontSize: '18px', color: '#f3ff5f' }}>
            GAME OVER
            </div>
            <div style={{ 
              fontSize: '16px', 
              marginTop: '5px',
              color: isWinner ? '#00ff00' : '#ff6666'
            }}>
              {isWinner ? 'YOU WIN!' : 'YOU LOSE!'}
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '16px' }}>
              Playing to {GAME_CONFIG.winningScore}
            </div>
            <div style={{ fontSize: '14px', marginTop: '5px', color: '#aaa' }}>
              {gameStatus.toUpperCase()}
            </div>
          </div>
        )}
      </div>
      
      <div className="player2-score" style={{
        textAlign: 'center',
        flex: 1,
        backgroundColor: playerNumber === 2 ? '#4a4a4a' : 'transparent',
        padding: '10px',
        borderRadius: '5px'
      }}>
        <div style={{ fontSize: '16px', marginBottom: '5px' }}>
          Player 2 {playerNumber === 2 && '(You)'}
        </div>
        <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
          {score.player2}
        </div>
      </div>
    </div>
  );
};