import { NextResponse } from "next/server";
import { positions } from "../shared";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { positions },
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
