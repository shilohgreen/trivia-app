import { NextRequest, NextResponse } from "next/server";
import { positions, scores } from "../shared";
import { scoreRequestBody, TeamColour } from "../types";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { isIncrease, teamColour }: scoreRequestBody = await request.json();

  console.log(teamColour);
  console.log(isIncrease);
  if (!(teamColour in TeamColour)) {
    return NextResponse.json(
      { error: "colour not recognized" },
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (isIncrease) {
    scores[teamColour] = (scores[teamColour] || 0) + 1;
  } else {
    scores[teamColour] = (scores[teamColour] || 0) - 1;
  }

  console.log(scores);

  return NextResponse.json(
    { message: "Score updated", scores },
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
