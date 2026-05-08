import { NextResponse } from "next/server";
import { workspaceTools, getToolByName } from "@/lib/ai/tool-registry";

export async function GET() {
  return NextResponse.json(
    workspaceTools.map((tool) => ({
      name: tool.name,
      label: tool.label,
      description: tool.description,
      category: tool.category,
      outputKind: tool.outputKind,
      producesArtifacts: tool.producesArtifacts,
    })),
  );
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const tool = getToolByName(body.toolName);
  if (!tool) {
    return NextResponse.json({ error: "Unknown tool" }, { status: 404 });
  }

  const input = tool.inputSchema.safeParse(body.input ?? {});
  if (!input.success) {
    return NextResponse.json({ error: "Invalid tool input", detail: input.error.flatten() }, { status: 400 });
  }

  const result = await tool.execute(input.data);
  return NextResponse.json(result);
}
