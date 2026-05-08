import { NextResponse } from "next/server";
import { runBackendProxy } from "@/lib/api/backend-proxy";

export async function GET() {
  const result = await runBackendProxy<{ status?: string; appTitle?: string }>({
    path: "/health",
    method: "GET",
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        reachable: false,
        status: "unreachable",
        appTitle: "TW AI Research Backend",
        error: result.error.message,
        meta: result.meta,
      },
      { status: 200 },
    );
  }

  return NextResponse.json(
    {
      reachable: true,
      status: result.data.status ?? "ok",
      appTitle: result.data.appTitle ?? "TW AI Research Backend",
      meta: result.meta,
    },
    { status: 200 },
  );
}
