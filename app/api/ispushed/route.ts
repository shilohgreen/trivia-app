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

  // If not in array, then button has not been pushed
  if (!positions.includes(teamColour)) {
    return NextResponse.json(
      { message: false },
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // If in array, then button has been pushed
  return NextResponse.json(
    { message: true },
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
