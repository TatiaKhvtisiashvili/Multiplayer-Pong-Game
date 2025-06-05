import React from 'react';

interface WaitingRoomProps {
  onJoinGame: () => void;
  isWaiting: boolean;
  connected: boolean;
}

export const WaitingRoom: React.FC<WaitingRoomProps> = ({ onJoinGame, isWaiting, connected }) => {
  return (
    <div className="waiting-room" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      padding: '40px',
      backgroundColor: '#1a1a1a',
      border: '2px solid #333',
      borderRadius: '15px',
      color: 'white',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>
        🏓
      </div>
      
      <h1 style={{ 
        fontSize: '36px', 
        marginBottom: '20px',
        color: '#f3ff5f'
      }}>
        Multiplayer Ping Pong
      </h1>
      
      {!connected ? (
        <div>
          <div style={{ fontSize: '18px', color: '#f2301d', marginBottom: '20px' }}>
            ❌ Disconnected from server ❌
          </div>
          <div style={{ fontSize: '14px', color: '#aaa' }}>
            Attempting to reconnect...
          </div>
        </div>
      ) : isWaiting ? (
        <div>
          <div style={{ fontSize: '20px', marginBottom: '20px', color: '#f3ff5f' }}>
            Waiting for another player...
          </div>
          <div className="loading-animation" style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid #333',
            borderTop: '4px solid #f3ff5f',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      ) : (
        <div>
           <button
            onClick={onJoinGame}
            style={{
              fontSize: '20px',
              padding: '15px 30px',
              backgroundColor: '#f3ff5f',
              color: 'Black',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f2301d';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f3ff5f';
            }}
          >
            Join Game
          </button>
          
          <div style={{ 
            fontSize: '14px', 
            marginTop: '30px', 
            color: '#aaa',
            lineHeight: '1.5'
          }}>
            <div><strong>Controls:</strong></div>
            <div>↑ Arrow Key - Move paddle up</div>
            <div>↓ Arrow Key - Move paddle down</div>
            <div style={{ marginTop: '10px' }}>
              <strong>Goal:</strong> First to {5} points wins!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};