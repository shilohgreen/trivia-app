import { NextResponse } from "next/server";
import { positions } from "../shared"; // Assuming setPositions is a function to update positions

// Clear the positions array

export async function GET(): Promise<NextResponse> {
  // Cant reassign position as it binded as an import
  // Usually you can reassign let though
  // Side note: Scoping leaks downwards but not upwards
  positions.length = 0;

  return NextResponse.json(
    { message: "Positions cleared" },
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
