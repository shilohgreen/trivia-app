import { NextRequest, NextResponse } from "next/server";
import { positions } from "../shared";

export async function GET(request: NextRequest): Promise<NextResponse> {
  console.log("target url: ", Object.fromEntries(request.headers)["referer"]);

  const teamColour = Object.fromEntries(request.headers)
    ["referer"].split("/")
    .pop();

  if (typeof teamColour !== "string") {
    return NextResponse.json(
      { error: "Did not receive a team colour" },
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (positions.includes(teamColour)) {
    return NextResponse.json(
      { error: "You have already pushed the button" },
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  // Right most position is the most recent button push
  positions.push(teamColour);

  if (positions.length > 0) {
    console.log("POSITIONS: ", positions);
  }

  return NextResponse.json(
    { message: "BUTTON PUSHED" },
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
