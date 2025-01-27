import { NextResponse } from "next/server";
import redis from "@/lib/redis";
export async function GET(): Promise<NextResponse> {
  const QUEUE_KEY = process.env.REDIS_QUEUE_KEY || "button_press_queue";

  // Retrieve all items from the queue (earliest to latest order)
  const queueItems:string[] = await redis.lrange(QUEUE_KEY, 0, -1);

  // Reverse the array to place the earliest at the right (latest at the left)
  const positions = queueItems.reverse();
  
  return NextResponse.json(
    { positions },
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
