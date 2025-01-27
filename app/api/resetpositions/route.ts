import { NextResponse } from "next/server";
import redis from "@/lib/redis";

// Clear the positions array

export async function GET(): Promise<NextResponse> {

  const QUEUE_KEY = process.env.REDIS_QUEUE_KEY || "button_press_queue";

  // Retrieve and clear the button queue from Redis
  await redis.del(QUEUE_KEY);

  return NextResponse.json(
    { message: "Positions cleared" },
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
