import { NextResponse } from "next/server";
import demoSession from "@/fixtures/demo/session-demo.json";

export async function GET() {
  return NextResponse.json({
    sessions: demoSession.sessions,
    note: "Client-side localStorage session persistence is used in runtime.",
  });
}
