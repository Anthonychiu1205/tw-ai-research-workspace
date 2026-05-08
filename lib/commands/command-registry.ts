import { createDefaultOperationRequest } from "@/lib/operations/operation-runner";
import type { WorkspaceCommand } from "@/lib/commands/command-types";

export function getWorkspaceCommands(input: { canUseApiMode: boolean }): WorkspaceCommand[] {
  const apiUnavailableReason = input.canUseApiMode ? undefined : "Backend API not reachable. Mock mode remains available.";

  return [
    {
      id: "analyze-2330",
      label: "Analyze 2330",
      description: "Run bounded synthetic research for 2330 台積電",
      category: "operations",
      shortcut: "A",
      run: async (context) => {
        await context.enqueueOperation(createDefaultOperationRequest("run_research"));
      },
    },
    {
      id: "report-2330",
      label: "Generate report for 2330",
      description: "Generate synthetic report sections",
      category: "operations",
      shortcut: "R",
      run: async (context) => {
        await context.enqueueOperation(createDefaultOperationRequest("generate_report"));
      },
    },
    {
      id: "pipeline-2330",
      label: "Run planner pipeline for 2330",
      description: "Execute bounded planner/executor/reflection trace",
      category: "operations",
      shortcut: "P",
      run: async (context) => {
        await context.enqueueOperation(createDefaultOperationRequest("run_pipeline"));
      },
    },
    {
      id: "compare-watchlist",
      label: "Compare strategies for watchlist",
      description: "Run synthetic strategy comparison for 2330/2317/2454/2308/0050",
      category: "operations",
      run: async (context) => {
        await context.enqueueOperation(createDefaultOperationRequest("compare_strategies"));
      },
    },
    {
      id: "signals-watchlist",
      label: "Evaluate signals for watchlist",
      description: "Run synthetic signal distribution and factor coverage",
      category: "operations",
      run: async (context) => {
        await context.enqueueOperation(createDefaultOperationRequest("evaluate_signals"));
      },
    },
    {
      id: "open-artifact-browser",
      label: "Open artifact browser",
      description: "Focus artifact workbench",
      category: "navigation",
      run: (context) => context.navigate("#artifacts"),
    },
    {
      id: "open-planner-trace",
      label: "Open planner trace",
      description: "Focus pipeline trace artifacts",
      category: "navigation",
      run: (context) => context.navigate("#trace"),
    },
    {
      id: "open-report-viewer",
      label: "Open report viewer",
      description: "Focus report artifacts",
      category: "navigation",
      run: (context) => context.navigate("#report"),
    },
    {
      id: "switch-mock-mode",
      label: "Switch to mock mode",
      description: "Switch runtime mode to mock for deterministic local demo",
      category: "runtime",
      shortcut: "M",
      run: (context) => context.setRuntimeMode("mock"),
    },
    {
      id: "check-backend-health",
      label: "Check backend health",
      description: "Probe backend /health and update fallback state",
      category: "runtime",
      unavailableReason: apiUnavailableReason,
      run: async (context) => {
        await context.checkBackendHealth();
      },
    },
  ];
}
