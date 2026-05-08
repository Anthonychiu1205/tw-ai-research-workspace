import { NextResponse } from "next/server";
import { runResearch } from "@/lib/api/client";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const result = await runResearch(body);
  if (result.ok) {
    return NextResponse.json({ data: result.data, meta: result.meta });
  }
  return NextResponse.json(
    {
      warning: result.error.message,
      fallback: result.meta.fallbackUsed,
      meta: result.meta,
      data: result.fallbackData,
    },
    { status: 200 },
  );
}
