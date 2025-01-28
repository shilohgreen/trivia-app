import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";
import { teamColours } from "../shared";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const ITEM_SET_KEY = process.env.REDIS_SET_KEY || "button_press_set";

  // Get the team colour from the url
  const teamColour = Object.fromEntries(request.headers)
    ["referer"].split("/")
    .pop();

  // IF NOT A VALID COLOUR, RETURN ERROR
  if (typeof teamColour !== "string" || !teamColours.includes(teamColour)) {
    return NextResponse.json(
      { error: "Did not receive a team valid colour" },
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const teamColoursSet = await redis.smembers(ITEM_SET_KEY);
  console.log("Current team colours in set:", teamColoursSet);

  const exists = Boolean(await redis.sismember(ITEM_SET_KEY, teamColour));

  // If not in array, then button has not been pushed
  if (!exists) {
    console.log("Button state: not pushed");
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
