import type * as Party from "partykit/server";
import { ColorDictionary, ColorArray, ValidColor } from "./types";

export default class Server implements Party.Server {
  // Initialize color dictionary with zero counts
  private colorCounts: ColorDictionary = {
    pink: 0,
    red: 0,
    purple: 0,
    green: 0,
    blue: 0,
  };

  // Initialize empty color array
  private selectedColors: ColorArray = [];

  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.room.id}
  url: ${new URL(ctx.request.url).pathname}`
    );

    // Send current state to the new connection
    conn.send(
      JSON.stringify({
        type: "init",
        colorCounts: this.colorCounts,
        selectedColors: this.selectedColors,
      })
    );
  }

  onMessage(message: string, sender: Party.Connection) {
    // Log the received message
    console.log(`Received message from ${sender.id}:`, message);
    
    try {
      // Parse the message
      const data = JSON.parse(message);
      console.log("Parsed data:", data);

      
      // Send updated state to all connections
      this.room.broadcast(
        JSON.stringify({
          type: "update",
          colorCounts: this.colorCounts,
          selectedColors: this.selectedColors,
        })
      );
    } catch (error) {
      console.error("Error processing message:", error);
      sender.send(JSON.stringify({ type: "error", message: "Invalid message format" }));
    }
  }

  // Helper method to validate colors
  private isValidColor(color: any): color is ValidColor {
    return ["pink", "red", "purple", "green", "blue"].includes(color);
  }
}

Server satisfies Party.Worker;
