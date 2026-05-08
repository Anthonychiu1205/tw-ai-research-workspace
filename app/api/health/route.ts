import { NextResponse } from "next/server";
import { checkBackendHealth } from "@/lib/api/client";
import { getEnvConfig } from "@/lib/config/env";

export async function GET() {
  const env = getEnvConfig();
  const health = await checkBackendHealth({
    runtimeOverrides: {
      mode: env.workspaceMode,
      apiBaseUrl: env.apiBaseUrl,
    },
  });

  return NextResponse.json({ mode: env.workspaceMode, ...health });
}
