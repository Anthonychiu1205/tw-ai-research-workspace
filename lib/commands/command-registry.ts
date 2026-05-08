import { createDefaultOperationRequest } from "@/lib/operations/operation-runner";
import type { WorkspaceCommand } from "@/lib/commands/command-types";
import type { Locale } from "@/lib/i18n/types";

type CommandCopy = {
  analyze2330: string;
  report2330: string;
  pipeline2330: string;
  compareWatchlist: string;
  signalWatchlist: string;
  switchMock: string;
  checkBackend: string;
  openArtifactBrowser: string;
  openPlannerTrace: string;
  openReportViewer: string;
  apiUnavailable: string;
};

const COMMAND_COPY: Record<Locale, CommandCopy> = {
  "en-US": {
    analyze2330: "Analyze 2330",
    report2330: "Generate 2330 Research Report",
    pipeline2330: "Run 2330 Planner Pipeline",
    compareWatchlist: "Compare Watchlist Strategies",
    signalWatchlist: "Evaluate Watchlist Signals",
    switchMock: "Switch to Mock Mode",
    checkBackend: "Check Backend Health",
    openArtifactBrowser: "Open artifact browser",
    openPlannerTrace: "Open planner trace",
    openReportViewer: "Open report viewer",
    apiUnavailable: "Backend API not reachable. Mock mode remains available.",
  },
  "zh-TW": {
    analyze2330: "分析 2330",
    report2330: "產生 2330 研究報告",
    pipeline2330: "執行 2330 planner pipeline",
    compareWatchlist: "比較 watchlist 策略",
    signalWatchlist: "評估 watchlist 訊號",
    switchMock: "切換到 mock 模式",
    checkBackend: "檢查後端連線",
    openArtifactBrowser: "開啟 artifact 瀏覽",
    openPlannerTrace: "開啟 planner trace",
    openReportViewer: "開啟報告檢視",
    apiUnavailable: "後端 API 無法連線，仍可使用 mock 模式。",
  },
};

export function getWorkspaceCommands(input: { canUseApiMode: boolean; locale?: Locale }): WorkspaceCommand[] {
  const locale = input.locale ?? "zh-TW";
  const copy = COMMAND_COPY[locale];
  const apiUnavailableReason = input.canUseApiMode ? undefined : copy.apiUnavailable;

  return [
    {
      id: "analyze-2330",
      label: copy.analyze2330,
      description: "Run bounded synthetic research for 2330 台積電",
      category: "operations",
      shortcut: "A",
      run: async (context) => {
        await context.enqueueOperation(createDefaultOperationRequest("run_research"));
      },
    },
    {
      id: "report-2330",
      label: copy.report2330,
      description: "Generate synthetic report sections",
      category: "operations",
      shortcut: "R",
      run: async (context) => {
        await context.enqueueOperation(createDefaultOperationRequest("generate_report"));
      },
    },
    {
      id: "pipeline-2330",
      label: copy.pipeline2330,
      description: "Execute bounded planner/executor/reflection trace",
      category: "operations",
      shortcut: "P",
      run: async (context) => {
        await context.enqueueOperation(createDefaultOperationRequest("run_pipeline"));
      },
    },
    {
      id: "compare-watchlist",
      label: copy.compareWatchlist,
      description: "Run synthetic strategy comparison for 2330/2317/2454/2308/0050",
      category: "operations",
      run: async (context) => {
        await context.enqueueOperation(createDefaultOperationRequest("compare_strategies"));
      },
    },
    {
      id: "signals-watchlist",
      label: copy.signalWatchlist,
      description: "Run synthetic signal distribution and factor coverage",
      category: "operations",
      run: async (context) => {
        await context.enqueueOperation(createDefaultOperationRequest("evaluate_signals"));
      },
    },
    {
      id: "open-artifact-browser",
      label: copy.openArtifactBrowser,
      description: "Focus artifact workbench",
      category: "navigation",
      run: (context) => context.navigate("#artifacts"),
    },
    {
      id: "open-planner-trace",
      label: copy.openPlannerTrace,
      description: "Focus pipeline trace artifacts",
      category: "navigation",
      run: (context) => context.navigate("#trace"),
    },
    {
      id: "open-report-viewer",
      label: copy.openReportViewer,
      description: "Focus report artifacts",
      category: "navigation",
      run: (context) => context.navigate("#report"),
    },
    {
      id: "switch-mock-mode",
      label: copy.switchMock,
      description: "Switch runtime mode to mock for deterministic local demo",
      category: "runtime",
      shortcut: "M",
      run: (context) => context.setRuntimeMode("mock"),
    },
    {
      id: "check-backend-health",
      label: copy.checkBackend,
      description: "Probe backend /health and update fallback state",
      category: "runtime",
      unavailableReason: apiUnavailableReason,
      run: async (context) => {
        await context.checkBackendHealth();
      },
    },
  ];
}
