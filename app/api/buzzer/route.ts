import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";
import { teamColours } from "../shared";

const QUEUE_KEY = process.env.REDIS_QUEUE_KEY || "button_press_queue";
const ITEM_SET_KEY = process.env.REDIS_SET_KEY || "button_press_set"; 

export async function GET(request: NextRequest): Promise<NextResponse> {
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

  const item = JSON.stringify({
    teamColour,
    timestamp: Date.now(),
  });

  // Check if the item exists in the queue set
  const exists = Boolean(await redis.sismember(ITEM_SET_KEY, teamColour));

  // IF ALREADY PUSHED, RETURN ERROR (TECHNICALLY SHOULD NOT HAPPEN BECAUSE BUTTON CAN ONLY BE PUSHED ONCE ON CLIENT)
  if (exists) {
    return NextResponse.json(
      { error: "" },
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Push to queue and add to set
  await redis.rpush(QUEUE_KEY, item);
  await redis.sadd(ITEM_SET_KEY, teamColour);

  return NextResponse.json(
    { message: "BUTTON PUSHED" },
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
