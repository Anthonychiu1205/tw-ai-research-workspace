"use client";

import { useEffect, useMemo, useState } from "react";
import sessionDemo from "@/fixtures/demo/session-demo.json";
import { AppShell } from "@/components/app-shell/app-shell";
import { CommandMenu } from "@/components/app-shell/command-menu";
import { KeyboardShortcutsHelp } from "@/components/app-shell/keyboard-shortcuts-help";
import { ResearchChat } from "@/components/chat/research-chat";
import { SessionHistory } from "@/components/workspace/session-history";
import { ArtifactBrowser } from "@/components/workspace/artifact-browser";
import { ArtifactDetailPanel } from "@/components/workspace/artifact-detail-panel";
import { WorkspaceContextPanel } from "@/components/workspace/workspace-context-panel";
import { ResearchOperationPanel } from "@/components/operations/research-operation-panel";
import { BackendConnectionCard } from "@/components/workspace/backend-connection-card";
import { RuntimeSettingsPanel } from "@/components/workspace/runtime-settings-panel";
import { WorkspaceExportActions } from "@/components/workspace/workspace-export-actions";
import { BackendCapabilitiesPanel } from "@/components/workspace/backend-capabilities-panel";
import { ScenarioLauncher } from "@/components/scenarios/scenario-launcher";
import { WelcomePanel } from "@/components/onboarding/welcome-panel";
import { DemoJourney } from "@/components/onboarding/demo-journey";
import { QuickstartChecklist } from "@/components/onboarding/quickstart-checklist";
import { WorkspaceModeExplainer } from "@/components/onboarding/workspace-mode-explainer";
import { createSessionStore } from "@/lib/sessions/session-store";
import { createArtifactStore } from "@/lib/artifacts/artifact-store";
import { getModelOptions, getProviderUnavailableReason } from "@/lib/config/models";
import {
  restoreRuntimeSettings,
  persistRuntimeSettings,
  resetRuntimeSettings,
  buildBackendConnectionState,
  getDefaultRuntimeSettings,
} from "@/lib/config/runtime";
import { getWorkspaceCommands } from "@/lib/commands/command-registry";
import { createDefaultOperationRequest, runResearchOperation } from "@/lib/operations/operation-runner";
import type { ResearchOperationRequest } from "@/lib/operations/operation-types";
import { discoverBackendCapabilities, type BackendCapabilitiesReport } from "@/lib/api/capabilities";
import { useWorkspaceShortcuts } from "@/lib/keyboard/shortcuts";
import { parseWorkspaceUrlState, serializeWorkspaceUrlState, type WorkspaceView } from "@/lib/utils/url-state";
import { createId } from "@/lib/utils/ids";
import {
  readLiveIntegrationSnapshot,
  writeLiveIntegrationSnapshot,
  type LiveIntegrationSnapshot,
} from "@/lib/utils/live-integration-cache";
import type { BackendConnectionState, WorkspaceSession } from "@/lib/schemas/workspace";
import type { WorkspaceArtifactRecord } from "@/lib/artifacts/artifact-types";
import { useI18n } from "@/lib/i18n/use-i18n";

function seedSessions(): WorkspaceSession[] {
  return (sessionDemo.sessions as any[]).map((session) => ({
    schemaVersion: "workspace-session.v0.2",
    runtimeMode: "mock",
    modelId: "mock-research",
    provider: "mock",
    messages: [],
    artifacts: [],
    ...session,
  }));
}

function toolNameToArtifactType(toolName: string): WorkspaceArtifactRecord["type"] | null {
  if (toolName === "runResearch") return "research_card";
  if (toolName === "generateReport") return "report";
  if (toolName === "runPipeline") return "pipeline_trace";
  if (toolName === "compareStrategies") return "strategy_comparison";
  if (toolName === "evaluateSignals") return "signal_evaluation";
  if (toolName === "getEvidenceTimeline") return "evidence_timeline";
  if (toolName === "runPortfolioReview") return "portfolio_review";
  if (toolName === "runBacktestV2") return "backtest_v2_summary";
  return null;
}

function defaultCapabilitiesReport(baseUrl: string): BackendCapabilitiesReport {
  return {
    reachable: false,
    baseUrl,
    checkedAt: new Date().toISOString(),
    capabilities: [],
    missing: [],
    warnings: ["Capabilities not checked yet."],
    mode: "mock",
    fallbackActive: false,
  };
}

export default function WorkspacePage() {
  const { t, locale } = useI18n();
  const sessionStore = useMemo(() => createSessionStore(seedSessions()), []);
  const artifactStore = useMemo(() => createArtifactStore(), []);
  const [sessions, setSessions] = useState(() => sessionStore.list());
  const [artifacts, setArtifacts] = useState(() => artifactStore.listAll());
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(sessions[0]?.id ?? null);
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<WorkspaceView>("chat");
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [runtimeSettings, setRuntimeSettings] = useState(() => {
    try {
      return restoreRuntimeSettings();
    } catch {
      return getDefaultRuntimeSettings();
    }
  });
  const [connectionState, setConnectionState] = useState<BackendConnectionState>({
    mode: runtimeSettings.mode,
    apiBaseUrl: runtimeSettings.apiBaseUrl,
    reachable: false,
    checkedAt: undefined,
    appTitle: "TW AI Research Backend",
    error: undefined,
    fallbackActive: runtimeSettings.mode === "api",
    fallbackReason: runtimeSettings.mode === "api" ? "Backend not checked yet" : undefined,
  });
  const [capabilitiesReport, setCapabilitiesReport] = useState<BackendCapabilitiesReport>(
    defaultCapabilitiesReport(runtimeSettings.apiBaseUrl),
  );
  const [lastLiveIntegration, setLastLiveIntegration] = useState<LiveIntegrationSnapshot | null>(null);
  const [systemEvents, setSystemEvents] = useState<Array<{ id: string; content: string }>>([]);
  const [scenariosCompleted, setScenariosCompleted] = useState<string[]>([]);

  const refreshSessions = () => setSessions(sessionStore.list());
  const refreshArtifacts = () => setArtifacts(artifactStore.listAll());

  const selectedArtifact = artifacts.find((artifact) => artifact.id === selectedArtifactId);
  const modelOptions = getModelOptions();

  useEffect(() => {
    setLastLiveIntegration(readLiveIntegrationSnapshot());
  }, []);

  useEffect(() => {
    const urlState = parseWorkspaceUrlState(window.location.search);
    if (urlState.session) {
      setSelectedSessionId(urlState.session);
    }
    if (urlState.artifact) {
      setSelectedArtifactId(urlState.artifact);
    }
    if (urlState.view) {
      setActiveView(urlState.view);
    }
  }, []);

  useEffect(() => {
    const next = serializeWorkspaceUrlState({
      session: selectedSessionId ?? undefined,
      artifact: selectedArtifactId ?? undefined,
      view: activeView,
    });
    if (typeof window !== "undefined") {
      const url = `${window.location.pathname}${next}`;
      window.history.replaceState(null, "", url);
    }
  }, [activeView, selectedArtifactId, selectedSessionId]);

  const checkConnection = async () => {
    const next = await buildBackendConnectionState(runtimeSettings);
    setConnectionState(next);
    const snapshot: LiveIntegrationSnapshot = {
      checkedAt: next.checkedAt ?? new Date().toISOString(),
      baseUrl: next.apiBaseUrl,
      reachable: next.reachable,
      fallbackActive: next.fallbackActive,
      fallbackReason: next.fallbackReason,
      source: "connection_check",
    };
    writeLiveIntegrationSnapshot(snapshot);
    setLastLiveIntegration(snapshot);
  };

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const next = await buildBackendConnectionState(runtimeSettings);
      if (!cancelled) {
        setConnectionState(next);
        const snapshot: LiveIntegrationSnapshot = {
          checkedAt: next.checkedAt ?? new Date().toISOString(),
          baseUrl: next.apiBaseUrl,
          reachable: next.reachable,
          fallbackActive: next.fallbackActive,
          fallbackReason: next.fallbackReason,
          source: "connection_check",
        };
        writeLiveIntegrationSnapshot(snapshot);
        setLastLiveIntegration(snapshot);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [runtimeSettings.mode, runtimeSettings.apiBaseUrl, runtimeSettings.apiBridgeMode, runtimeSettings.fallbackToMock]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const report = await discoverBackendCapabilities(runtimeSettings);
      if (!cancelled) {
        setCapabilitiesReport(report);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [runtimeSettings]);

  const applySettings = (patch: Partial<typeof runtimeSettings>) => {
    const next = persistRuntimeSettings({ ...runtimeSettings, ...patch });
    setRuntimeSettings(next);
  };

  const emitSystemEvent = (content: string) => {
    setSystemEvents((prev) => [...prev, { id: createId("system-event"), content }]);
  };

  useWorkspaceShortcuts({
    onCommandMenu: () => setCommandMenuOpen((prev) => !prev),
    onNewSession: () => {
      const session = sessionStore.create(t("app.workspace"));
      setSelectedSessionId(session.id);
      refreshSessions();
      emitSystemEvent(`${t("sessions.history")} #${session.id}`);
    },
    onToggleSidebar: () => setSidebarHidden((prev) => !prev),
    onHelp: () => setShortcutsOpen((prev) => !prev),
  });

  const commands = getWorkspaceCommands({ canUseApiMode: connectionState.reachable, locale });

  const runOperationAndTrack = async (request: ResearchOperationRequest) => {
    const result = await runResearchOperation(request, artifactStore);
    if (result.artifactIds[0]) {
      setSelectedArtifactId(result.artifactIds[0]);
      setActiveView("chat");
    }
    refreshArtifacts();
    emitSystemEvent(
      `${result.kind} status=${result.status}. artifacts=${result.artifactIds.join(",") || "none"}. ${t("disclaimers.nonAdvice")}`,
    );
    return result;
  };

  const showOnboarding = artifacts.length === 0;

  return (
    <AppShell
      sessions={sessions.map((session) => ({ id: session.id, title: session.title }))}
      artifacts={artifacts.map((artifact) => ({ id: artifact.id, title: artifact.title }))}
      backendStatus={connectionState.reachable ? "ok" : "optional"}
      mode={runtimeSettings.mode}
      modelLabel={runtimeSettings.selectedModel}
      connection={connectionState}
      sidebarHidden={sidebarHidden}
      onQuickAnalyze={async () => {
        await runOperationAndTrack(createDefaultOperationRequest("run_research"));
      }}
    >
      <div className="grid h-full grid-cols-12 gap-4" data-testid="workspace-page-grid">
        <aside className="col-span-3 min-h-0 space-y-3 overflow-auto">
          <SessionHistory
            sessions={sessions.map((session) => ({ id: session.id, title: session.title }))}
            selectedSessionId={selectedSessionId}
            onCreate={() => {
              const session = sessionStore.create(t("app.workspace"));
              setSelectedSessionId(session.id);
              refreshSessions();
            }}
            onSelect={setSelectedSessionId}
            onDelete={(id) => {
              sessionStore.remove(id);
              if (selectedSessionId === id) setSelectedSessionId(null);
              refreshSessions();
            }}
          />

          <ArtifactBrowser artifacts={artifacts} selectedArtifactId={selectedArtifactId} onSelect={setSelectedArtifactId} />

          <CommandMenu
            commands={commands}
            open={commandMenuOpen}
            onClose={() => setCommandMenuOpen(false)}
            onRun={async (command) => {
              await command.run({
                canUseApiMode: connectionState.reachable,
                enqueueOperation: async (request) => runOperationAndTrack(request),
                navigate: (path) => {
                  if (path.includes("report")) setActiveView("report");
                  else if (path.includes("trace")) setActiveView("trace");
                  else if (path.includes("strategy")) setActiveView("strategy");
                  else if (path.includes("signal")) setActiveView("signals");
                  else if (path.includes("portfolio")) setActiveView("portfolio");
                  else setActiveView("chat");
                },
                setRuntimeMode: (mode) => applySettings({ mode }),
                checkBackendHealth: checkConnection,
              });
            }}
          />

          {shortcutsOpen ? <KeyboardShortcutsHelp /> : null}
        </aside>

        <section className="col-span-6 min-h-0 space-y-3 overflow-auto">
          {showOnboarding ? (
            <div className="space-y-3" data-testid="workspace-onboarding">
              <WelcomePanel
                onStart2330={async () => {
                  await runOperationAndTrack(createDefaultOperationRequest("run_research"));
                }}
                onCompareWatchlist={async () => {
                  await runOperationAndTrack(createDefaultOperationRequest("compare_strategies"));
                }}
                onOpenTrace={async () => {
                  setActiveView("trace");
                  await runOperationAndTrack(createDefaultOperationRequest("run_pipeline"));
                }}
                onConnectBackend={() => {
                  applySettings({ mode: "api", apiBridgeMode: "proxy" });
                }}
              />
              <DemoJourney />
              <QuickstartChecklist />
              <WorkspaceModeExplainer />
            </div>
          ) : null}

          <ResearchChat
            runtimeSettings={runtimeSettings}
            connectionState={connectionState}
            onRuntimeSettingsChange={applySettings}
            systemEvents={systemEvents}
            onToolResult={(payload) => {
              const toolName = String(payload.toolName ?? "");
              const type = toolNameToArtifactType(toolName);
              if (!type) return;

              const artifact = artifactStore.create({
                sessionId: selectedSessionId ?? undefined,
                type,
                title: `${toolName} artifact`,
                summary: String(payload.summary ?? t("tools.toolCalls")),
                source: (payload.source as WorkspaceArtifactRecord["source"]) ?? "mock",
                synthetic: Boolean(payload.source !== "api"),
                evidenceIds: Array.isArray(payload.evidenceIds) ? (payload.evidenceIds as string[]) : [],
                data: payload.data,
                lineage: {
                  toolCallId: String(payload.id ?? createId("tool")),
                },
              });

              setSelectedArtifactId(artifact.id);
              refreshArtifacts();
            }}
            onOpenArtifact={(artifactId) => {
              setSelectedArtifactId(artifactId);
            }}
          />

          <ScenarioLauncher
            artifactStore={artifactStore}
            onScenarioMessage={(content) => emitSystemEvent(content)}
            onArtifactCreated={(artifactId) => {
              setSelectedArtifactId(artifactId);
              refreshArtifacts();
            }}
            onScenarioCompleted={(scenarioId) => {
              setScenariosCompleted((prev) => (prev.includes(scenarioId) ? prev : [...prev, scenarioId]));
              emitSystemEvent(`${scenarioId} completed. ${t("disclaimers.nonAdvice")}`);
            }}
          />

          <ResearchOperationPanel
            artifactStore={artifactStore}
            onOperationCompleted={(result) => {
              emitSystemEvent(
                `Ran ${result.kind} operation from panel. status=${result.status}. artifact=${result.artifactIds[0] ?? "none"}.`,
              );
            }}
            onArtifactCreated={(id) => {
              setSelectedArtifactId(id);
              setActiveView("chat");
              refreshArtifacts();
            }}
          />
        </section>

        <aside className="col-span-3 min-h-0 space-y-3 overflow-auto">
          <BackendConnectionCard
            state={connectionState}
            lastLiveIntegration={lastLiveIntegration}
            onRefresh={() => void checkConnection()}
          />

          <RuntimeSettingsPanel
            settings={runtimeSettings}
            models={modelOptions}
            providerUnavailableReason={getProviderUnavailableReason(runtimeSettings.selectedProvider)}
            fallbackActive={connectionState.fallbackActive}
            onChange={applySettings}
            onReset={() => {
              const defaults = resetRuntimeSettings();
              setRuntimeSettings(defaults);
            }}
            onCheckBackend={() => void checkConnection()}
          />

          <BackendCapabilitiesPanel report={capabilitiesReport} />

          <WorkspaceExportActions
            sessions={sessions}
            artifacts={artifacts}
            runtimeSettings={runtimeSettings}
            scenariosCompleted={scenariosCompleted}
            onImport={({ sessions: importedSessions, artifacts: importedArtifacts, runtimeSettings: importedSettings, scenariosCompleted: importedScenarios }) => {
              sessionStore.clear();
              importedSessions.forEach((session) => sessionStore.upsert(session));
              artifactStore.clear();
              artifactStore.importJson(JSON.stringify(importedArtifacts));
              setRuntimeSettings(importedSettings);
              setScenariosCompleted(Array.isArray(importedScenarios) ? importedScenarios : []);
              refreshSessions();
              refreshArtifacts();
            }}
            onReset={() => {
              sessionStore.clear();
              artifactStore.clear();
              refreshSessions();
              refreshArtifacts();
              setSelectedSessionId(null);
              setSelectedArtifactId(null);
              setScenariosCompleted([]);
              const defaults = resetRuntimeSettings();
              setRuntimeSettings(defaults);
            }}
          />

          <ArtifactDetailPanel
            artifact={selectedArtifact}
            onPinToggle={(artifactId, pinned) => {
              if (pinned) {
                artifactStore.pin(artifactId);
              } else {
                artifactStore.unpin(artifactId);
              }
              refreshArtifacts();
            }}
          />

          <WorkspaceContextPanel artifact={selectedArtifact} />
        </aside>
      </div>
    </AppShell>
  );
}
