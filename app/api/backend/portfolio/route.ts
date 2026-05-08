import { NextResponse } from "next/server";
import { runBackendProxy } from "@/lib/api/backend-proxy";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const action = String((body as Record<string, unknown>).action ?? "review");
  const path = action === "rebalance-plan" ? "/v1/portfolio/rebalance-plan" : "/v1/portfolio/review";
  const result = await runBackendProxy({
    path,
    method: "POST",
    body,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error, meta: result.meta }, { status: result.status });
  }

  return NextResponse.json({ data: result.data, meta: result.meta }, { status: 200 });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const analysisId = url.searchParams.get("analysisId");

  if (!analysisId) {
    return NextResponse.json({ error: { message: "analysisId query is required" } }, { status: 400 });
  }

  const result = await runBackendProxy({
    path: `/v1/portfolio/${encodeURIComponent(analysisId)}`,
    method: "GET",
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error, meta: result.meta }, { status: result.status });
  }

  return NextResponse.json({ data: result.data, meta: result.meta }, { status: 200 });
}
