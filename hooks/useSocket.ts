import { useState, useEffect, useCallback } from 'react';
import PartySocket from 'partysocket';
import { ValidColor, ColorDictionary } from '../app/types';

// Message types
export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
}

export interface PlayerData {
  id: string;
  name: string;
  score: number;
}

// New message format for color data
export interface ColorMessage {
  pressedby: ValidColor;
  data: ColorDictionary;
}

export interface ButtonPushedMessage {
  type: 'buttonpress';
  color: ValidColor;
}

interface UseSocketProps {
  roomId?: string;
  playerId?: string;
  playerName?: string;
  onMessage?: (messageType: string, data: any) => void;
}

export const useSocket = ({ 
  roomId = 'default', 
  playerId = '', 
  playerName = 'Anonymous',
  onMessage 
}: UseSocketProps = {}) => {
  const [socket, setSocket] = useState<PartySocket | null>(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [players, setPlayers] = useState<PlayerData[]>([]);
//   const [currentPlayerId, setCurrentPlayerId] = useState<string>(playerId);

  useEffect(() => {
    // Determine host based on environment
    const host =
      process.env.NODE_ENV === 'production'
        ? 'https://your-production-host.partykit.dev'
        : 'localhost:1999';

    console.log("Connecting to socket server...");
    
    // Create PartySocket connection
    const partySocket = new PartySocket({
      host,
      room: roomId,
      id: playerId,
    });

    // Handle socket open
    partySocket.addEventListener('open', () => {
      console.log('Socket connection opened');
    });

    // Handle socket messages
    partySocket.addEventListener('message', (event) => {
    //   try {
    //     const messageData = event.data as string;
    //     const parsedData = JSON.parse(messageData);
        
    //     console.log('Received message:', parsedData);
        
    //     // Handle different message types
    //     if (parsedData.type === 'state') {
    //       if (parsedData.state && Array.isArray(parsedData.state.connections)) {
    //         setPlayers(parsedData.state.connections);
    //       }
    //     } else if (parsedData.type === 'chat') {
    //       if ('message' in parsedData && parsedData.message) {
    //         setMessages((prev) => [...prev, parsedData.message as ChatMessage]);
    //       }
    //     } else if (parsedData.type === 'connection') {
    //       if (typeof parsedData.id === 'string') {
    //         setCurrentPlayerId(parsedData.id);
    //       }
    //     }
        
    //     // Call the onMessage callback if provided
    //     if (onMessage) {
    //       onMessage(parsedData.type, parsedData);
    //     }
    //   } catch (error) {
    //     console.error('Error parsing message:', error);
    //   }
    });

    // Handle socket close
    partySocket.addEventListener('close', () => {
      console.log('Socket connection closed');
    //   setIsConnected(false);
    });

    // Handle socket errors
    partySocket.addEventListener('error', (error) => {
      console.error('Socket error:', error);
    });

    // Set socket in state
    setSocket(partySocket);

    // Clean up on unmount
    return () => {
      console.log('Closing socket connection');
      partySocket.close();
    };
  }, [socket]);

  // Function to send chat messages
  const sendMessage = useCallback((message: string) => {
    if (socket) {
      socket.send(message);
    } else {
      console.error('Socket not connected or empty message');
    }
  }, [socket]);

  // Function to send color data with specific format
  const sendColorData = useCallback((buttonPushData: ButtonPushedMessage) => {
    if (socket) {
      socket.send(JSON.stringify(buttonPushData));
    } else {
      console.error('Socket not connected');
    }
  }, [socket]);



  return {
    socket,
    sendMessage,
    sendColorData,
  };
};

export default useSocket;
