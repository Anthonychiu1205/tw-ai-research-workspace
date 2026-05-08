import { NextResponse } from "next/server";
import { runBackendProxy } from "@/lib/api/backend-proxy";

export async function GET() {
  const storage = await runBackendProxy({ path: "/v1/system/storage", method: "GET" });
  const provider = await runBackendProxy({ path: "/v1/system/provider", method: "GET" });

  const reachable = storage.ok || provider.ok;
  if (!reachable) {
    const err = storage.ok ? provider : storage;
    return NextResponse.json(
      {
        error: err.ok ? null : err.error,
        meta: err.ok ? null : err.meta,
      },
      { status: err.ok ? 502 : err.status },
    );
  }

  return NextResponse.json(
    {
      data: {
        storage: storage.ok ? storage.data : null,
        provider: provider.ok ? provider.data : null,
      },
      meta: {
        storage: storage.ok ? storage.meta : storage.meta,
        provider: provider.ok ? provider.meta : provider.meta,
      },
    },
    { status: 200 },
  );
}
