import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import PartySocket from "partysocket";

// Define the shape of the WebSocket context
interface WebSocketContextType {
  ws: WebSocket | null;
  isConnected: boolean;
  error: Error | null;
  sendMessage: (message: string) => void;
  closeConnection: () => void;
}

// Create the context with an initial undefined value
const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

// Provider component to manage the WebSocket connection
interface WebSocketProviderProps {
  children: ReactNode;
  url: string;
  maxReconnectAttempts?: number;
}

export function WebSocketProvider({
  children,
  url,
  maxReconnectAttempts = 5,
}: WebSocketProviderProps) {
  const [ws, setWs] = useState<PartySocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState<number>(0);

  // Function to establish or re-establish the WebSocket connection
  const connect = () => {
    const host =
      process.env.NODE_ENV === "production"
        ? "https://your-production-host.partykit.dev"
        : "localhost:1999";

    console.log("Connecting to socket server...");
    const partySocket = new PartySocket({
      host,
      room: "button-" + Math.random().toString(36).substring(2, 9),
    });
    setWs(partySocket);

    // ATTACH EVENT LISTENERS
    partySocket.addEventListener("open", () => {
      console.log("Socket connection opened");
    });

    partySocket.addEventListener("message", (event) => {
      console.log("Message received:", event.data);
    });

    // Handle socket close
    partySocket.addEventListener("close", () => {
      console.log("Socket connection closed");
      //   setIsConnected(false);
    });

    // Handle socket errors
    partySocket.addEventListener("error", (error) => {
      console.error("Socket error:", error);
    });
  };

  // Reconnection logic with exponential backoff
  //   const attemptReconnect = () => {
  //     if (reconnectAttempts < maxReconnectAttempts) {
  //       const delay = Math.min(1000 * 2 ** reconnectAttempts, 30000); // Caps at 30 seconds
  //       setTimeout(() => {
  //         console.log(`Reconnecting... Attempt ${reconnectAttempts + 1}`);
  //         setReconnectAttempts((prev) => prev + 1);
  //         connect();
  //       }, delay);
  //     } else {
  //       console.error('Max reconnection attempts reached');
  //       setError(new Error('Unable to reconnect after multiple attempts'));
  //     }
  //   };

  // Initialize the WebSocket when the component mounts
  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []); // Empty dependency array ensures this runs only once

  // Utility function to send messages
  const sendMessage = (message: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    } else {
      console.error("WebSocket is not open");
    }
  };

  // Utility function to manually close the connection
  const closeConnection = () => {
    if (ws) {
      ws.close();
    }
  };

  // Provide the WebSocket and utilities to consumers
  return (
    <WebSocketContext.Provider
      value={{
        ws,
        isConnected,
        error,
        sendMessage,
        closeConnection,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

// Custom hook for easy access to the WebSocket context
export function useWebSocket(): WebSocketContextType {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}
