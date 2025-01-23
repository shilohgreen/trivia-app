import { NextRequest, NextResponse } from "next/server";
import { positions, scores } from "../shared";
import { scoreRequestBody, TeamColours } from "../types";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  const { teamColour, isIncrease } = body;

  if (!(TeamColours.includes(teamColour)) || typeof isIncrease !== "boolean") {
    return NextResponse.json(
      { error: "Did not receive a valid team colour or boolean" },
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Change score accordingly
  scores[teamColour] = isIncrease
    ? scores[teamColour] + 1
    : Math.max(scores[teamColour] - 1, 0);

  console.log(`Score updated for ${teamColour}: ${scores[teamColour]}`);

  return NextResponse.json(
    { message: "Score updated successfully" },
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
