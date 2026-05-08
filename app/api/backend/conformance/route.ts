import { NextResponse } from "next/server";
import { runBackendProxy } from "@/lib/api/backend-proxy";

export async function GET() {
  const result = await runBackendProxy({
    path: "/v1/provider/conformance",
    method: "GET",
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error, meta: result.meta }, { status: result.status });
  }

  return NextResponse.json({ data: result.data, meta: result.meta }, { status: 200 });
}
