import { NextResponse } from "next/server";
import { runResearch } from "@/lib/api/client";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const result = await runResearch(body);
  if (result.ok) {
    return NextResponse.json(result.data);
  }
  return NextResponse.json(
    {
      warning: result.error.message,
      fallback: true,
      data: result.fallbackData,
    },
    { status: 200 },
  );
}
