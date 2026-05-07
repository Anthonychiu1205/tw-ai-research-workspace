import { NextResponse } from "next/server";
import { getHealth } from "@/lib/api/client";
import { getEnvConfig } from "@/lib/config/env";

export async function GET() {
  const env = getEnvConfig();
  const health = await getHealth();
  if (health.ok) {
    return NextResponse.json({ mode: env.workspaceMode, ...health.data });
  }
  return NextResponse.json({ mode: env.workspaceMode, status: "degraded", fallback: true }, { status: 200 });
}
