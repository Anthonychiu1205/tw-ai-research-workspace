import type { CapabilityContext, CapabilityStatus, WorkspaceCapabilityId } from "@/lib/availability/availability-types";

type Rule = {
  id: WorkspaceCapabilityId;
  label: string;
  description: string;
  mode: "mock" | "api" | "both";
  fallbackAvailable: boolean;
  eval: (ctx: CapabilityContext) => { available: boolean; reason?: string };
};

const rules: Rule[] = [
  {
    id: "run_research",
    label: "Run Research",
    description: "Run deterministic research flow.",
    mode: "both",
    fallbackAvailable: true,
    eval: () => ({ available: true }),
  },
  {
    id: "generate_report",
    label: "Generate Report",
    description: "Generate research report sections.",
    mode: "both",
    fallbackAvailable: true,
    eval: () => ({ available: true }),
  },
  {
    id: "run_pipeline",
    label: "Run Pipeline",
    description: "Run planner/executor/reflection trace.",
    mode: "both",
    fallbackAvailable: true,
    eval: () => ({ available: true }),
  },
  {
    id: "run_backtest",
    label: "Run Backtest",
    description: "Run hypothetical backtest summary.",
    mode: "both",
    fallbackAvailable: true,
    eval: () => ({ available: true }),
  },
  {
    id: "compare_strategies",
    label: "Compare Strategies",
    description: "Compare strategy simulation outputs.",
    mode: "both",
    fallbackAvailable: true,
    eval: () => ({ available: true }),
  },
  {
    id: "evaluate_signals",
    label: "Evaluate Signals",
    description: "Evaluate signal distribution and evidence.",
    mode: "both",
    fallbackAvailable: true,
    eval: () => ({ available: true }),
  },
  {
    id: "portfolio_review",
    label: "Portfolio Review",
    description: "Review target allocation simulation.",
    mode: "both",
    fallbackAvailable: true,
    eval: () => ({ available: true }),
  },
  {
    id: "backtest_v2",
    label: "Backtest v2",
    description: "Run portfolio-managed hypothetical backtest.",
    mode: "both",
    fallbackAvailable: true,
    eval: () => ({ available: true }),
  },
  {
    id: "open_artifact",
    label: "Open Artifact",
    description: "Open artifact details in context panel.",
    mode: "both",
    fallbackAvailable: true,
    eval: (ctx) => ({ available: (ctx.artifactCount ?? 0) > 0, reason: (ctx.artifactCount ?? 0) > 0 ? undefined : "No artifacts yet" }),
  },
  {
    id: "export_workspace",
    label: "Export Workspace",
    description: "Export workspace local state JSON.",
    mode: "both",
    fallbackAvailable: true,
    eval: () => ({ available: true }),
  },
  {
    id: "import_workspace",
    label: "Import Workspace",
    description: "Import workspace local state JSON.",
    mode: "both",
    fallbackAvailable: true,
    eval: () => ({ available: true }),
  },
  {
    id: "switch_model",
    label: "Switch Model",
    description: "Switch runtime model provider/model.",
    mode: "both",
    fallbackAvailable: true,
    eval: () => ({ available: true }),
  },
  {
    id: "api_mode",
    label: "API Mode",
    description: "Use live backend API mode.",
    mode: "api",
    fallbackAvailable: true,
    eval: (ctx) => {
      if (ctx.backend.reachable) {
        return { available: true };
      }
      return {
        available: false,
        reason: "Backend unavailable, mock fallback active",
      };
    },
  },
];

export function evaluateCapability(ctx: CapabilityContext, id: WorkspaceCapabilityId): CapabilityStatus {
  const rule = rules.find((item) => item.id === id);
  if (!rule) {
    return {
      id,
      label: id,
      description: id,
      mode: "both",
      available: false,
      reason: "Unknown capability",
      fallbackAvailable: false,
    };
  }

  const result = rule.eval(ctx);
  return {
    id: rule.id,
    label: rule.label,
    description: rule.description,
    mode: rule.mode,
    available: result.available,
    reason: result.reason,
    fallbackAvailable: rule.fallbackAvailable,
  };
}

export function listCapabilityRules() {
  return rules;
}
