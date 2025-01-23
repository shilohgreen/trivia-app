import { NextRequest, NextResponse } from "next/server";
import { positions, scores } from "../shared";
import { scoreRequestBody, TeamColours } from "../types";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body: scoreRequestBody = await request.json();
  const { teamColour, isIncrease } = body;

  // Actually dont need this part, but it's here just in case
  if (!TeamColours.includes(teamColour) || typeof isIncrease !== "boolean") {
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
    { updatedScore: scores },
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
