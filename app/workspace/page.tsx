"use client";

import { useEffect, useMemo, useState } from "react";
import sessionDemo from "@/fixtures/demo/session-demo.json";
import { AppShell } from "@/components/app-shell/app-shell";
import { CommandMenu } from "@/components/app-shell/command-menu";
import { KeyboardShortcutsHelp } from "@/components/app-shell/keyboard-shortcuts-help";
import { ResearchChat } from "@/components/chat/research-chat";
import { ArtifactBrowser } from "@/components/workspace/artifact-browser";
import { ArtifactDetailPanel } from "@/components/workspace/artifact-detail-panel";
import { WorkspaceContextPanel } from "@/components/workspace/workspace-context-panel";
import { ResearchOperationPanel } from "@/components/operations/research-operation-panel";
import { BackendConnectionCard } from "@/components/workspace/backend-connection-card";
import { RuntimeSettingsPanel } from "@/components/workspace/runtime-settings-panel";
import { WorkspaceExportActions } from "@/components/workspace/workspace-export-actions";
import { BackendCapabilitiesPanel } from "@/components/workspace/backend-capabilities-panel";
import { DemoWalkthroughPanel } from "@/components/workspace/demo-walkthrough-panel";
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
import { Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { workspaceContextColumnClass, workspaceMainColumnClass, workspacePageLayoutClass } from "@/lib/ui/layout";
import { buildCapabilityMatrix } from "@/lib/availability/capability-matrix";
import type { WorkspaceCapabilityId } from "@/lib/availability/availability-types";
import { CapabilityStatusList } from "@/components/workspace/capability-status-list";
import { InlineFeedback } from "@/components/ui/inline-feedback";

type WorkspaceTab = "operations" | "scenarios" | "artifacts";

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
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("scenarios");
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [runtimeSettings, setRuntimeSettings] = useState<ReturnType<typeof getDefaultRuntimeSettings>>(getDefaultRuntimeSettings);
  const [connectionState, setConnectionState] = useState<BackendConnectionState>({
    mode: "mock",
    apiBaseUrl: getDefaultRuntimeSettings().apiBaseUrl,
    reachable: false,
    checkedAt: undefined,
    appTitle: "TW AI Research Backend",
    error: undefined,
    fallbackActive: false,
    fallbackReason: undefined,
  });
  const [capabilitiesReport, setCapabilitiesReport] = useState<BackendCapabilitiesReport>(
    defaultCapabilitiesReport(runtimeSettings.apiBaseUrl),
  );
  const [lastLiveIntegration, setLastLiveIntegration] = useState<LiveIntegrationSnapshot | null>(null);
  const [systemEvents, setSystemEvents] = useState<Array<{ id: string; content: string }>>([]);
  const [scenariosCompleted, setScenariosCompleted] = useState<string[]>([]);
  const [checkingConnection, setCheckingConnection] = useState(false);
  const [interactionFeedback, setInteractionFeedback] = useState<{ tone: "success" | "warning" | "danger" | "neutral"; message: string; detail?: string } | null>(null);

  const refreshSessions = () => setSessions(sessionStore.list());
  const refreshArtifacts = () => setArtifacts(artifactStore.listAll());

  const selectedArtifact = artifacts.find((artifact) => artifact.id === selectedArtifactId);
  const modelOptions = getModelOptions();
  const capabilityMatrix = useMemo(
    () =>
      buildCapabilityMatrix({
        runtime: runtimeSettings,
        backend: connectionState,
        artifactCount: artifacts.length,
      }),
    [artifacts.length, connectionState, runtimeSettings],
  );
  const capabilityMap = useMemo(() => {
    const map: Partial<Record<WorkspaceCapabilityId, (typeof capabilityMatrix)[number]>> = {};
    for (const capability of capabilityMatrix) {
      map[capability.id] = capability;
    }
    return map;
  }, [capabilityMatrix]);

  useEffect(() => {
    try {
      setRuntimeSettings(restoreRuntimeSettings());
    } catch {
      setRuntimeSettings(getDefaultRuntimeSettings());
    }
    setLastLiveIntegration(readLiveIntegrationSnapshot());
  }, []);

  useEffect(() => {
    const urlState = parseWorkspaceUrlState(window.location.search);
    if (urlState.session) {
      setSelectedSessionId(urlState.session);
    }
    if (urlState.artifact) {
      setSelectedArtifactId(urlState.artifact);
      setActiveTab("artifacts");
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
    const url = `${window.location.pathname}${next}`;
    window.history.replaceState(null, "", url);
  }, [activeView, selectedArtifactId, selectedSessionId]);

  const checkConnection = async () => {
    setCheckingConnection(true);
    setInteractionFeedback({ tone: "neutral", message: t("backend.checking") });
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
    setCheckingConnection(false);
    if (next.reachable) {
      setInteractionFeedback({ tone: "success", message: t("backend.connected") });
    } else if (next.fallbackActive) {
      setInteractionFeedback({ tone: "warning", message: t("backend.apiFallback"), detail: next.fallbackReason });
    } else {
      setInteractionFeedback({ tone: "danger", message: t("backend.unreachable"), detail: next.error });
    }
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
      setActiveTab("artifacts");
    }
    refreshArtifacts();
    emitSystemEvent(
      `${result.kind} status=${result.status}. artifacts=${result.artifactIds.join(",") || "none"}. ${t("disclaimers.nonAdvice")}`,
    );
    if (result.status === "failed") {
      setInteractionFeedback({ tone: "danger", message: t("errors.generic"), detail: result.error });
    } else if (result.source === "mock_fallback") {
      setInteractionFeedback({ tone: "warning", message: t("backend.apiFallback"), detail: result.summary });
    } else {
      setInteractionFeedback({ tone: "success", message: t("common.completed"), detail: result.summary });
    }
    return result;
  };

  const showOnboarding = artifacts.length === 0;

  return (
    <AppShell
      sessions={sessions.map((session) => ({ id: session.id, title: session.title }))}
      artifacts={artifacts.map((artifact) => ({ id: artifact.id, title: artifact.title }))}
      mode={runtimeSettings.mode}
      modelLabel={runtimeSettings.selectedModel}
      connection={connectionState}
      sidebarHidden={sidebarHidden}
      onQuickAnalyze={async () => {
        await runOperationAndTrack(createDefaultOperationRequest("run_research"));
      }}
    >
      <div className={workspacePageLayoutClass()} data-testid="workspace-page-grid">
        <section className={workspaceMainColumnClass()}>
          <Panel>
            <SectionHeading
              title={t("app.workspace")}
              subtitle={t("app.entryTagline")}
            />
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge tone="mock">{t("disclaimers.syntheticBadge")}</StatusBadge>
              <StatusBadge tone="neutral">{runtimeSettings.mode === "mock" ? t("runtime.mockMode") : t("runtime.apiMode")}</StatusBadge>
              {!connectionState.reachable && runtimeSettings.mode === "api" ? (
                <StatusBadge tone="warning">{t("emptyStates.backendUnavailable")}</StatusBadge>
              ) : null}
            </div>
            {interactionFeedback ? (
              <div className="mt-3">
                <InlineFeedback tone={interactionFeedback.tone} message={interactionFeedback.message} detail={interactionFeedback.detail} />
              </div>
            ) : null}
          </Panel>

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
              setActiveTab("artifacts");
              refreshArtifacts();
            }}
            onOpenArtifact={(artifactId) => {
              setSelectedArtifactId(artifactId);
              setActiveTab("artifacts");
            }}
          />

          <Panel>
            <div className="mb-3 flex flex-wrap gap-2" data-testid="workspace-segmented-tabs">
              {(["operations", "scenarios", "artifacts"] as WorkspaceTab[]).map((tab) => (
                <Button
                  key={tab}
                  type="button"
                  size="sm"
                  variant={activeTab === tab ? "default" : "outline"}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "operations" ? t("nav.operations") : tab === "scenarios" ? t("nav.scenarios") : t("artifacts.title")}
                </Button>
              ))}
            </div>

            <div className={activeTab === "operations" ? "block" : "hidden"} data-testid="workspace-operations-zone">
              <ResearchOperationPanel
                artifactStore={artifactStore}
                capabilityMap={capabilityMap}
                onOperationCompleted={(result) => {
                  emitSystemEvent(
                    `Ran ${result.kind} operation from panel. status=${result.status}. artifact=${result.artifactIds[0] ?? "none"}.`,
                  );
                }}
                onArtifactCreated={(id) => {
                  setSelectedArtifactId(id);
                  setActiveView("chat");
                  setActiveTab("artifacts");
                  refreshArtifacts();
                }}
              />
            </div>

            <div className={activeTab === "scenarios" ? "block space-y-3" : "hidden"} data-testid="workspace-scenarios-zone">
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
                    <DemoWalkthroughPanel />
                    <QuickstartChecklist />
                    <WorkspaceModeExplainer />
                  </div>
                ) : null}

                <ScenarioLauncher
                  artifactStore={artifactStore}
                  onScenarioMessage={(content) => emitSystemEvent(content)}
                  onArtifactCreated={(artifactId) => {
                    setSelectedArtifactId(artifactId);
                    setActiveTab("artifacts");
                    refreshArtifacts();
                  }}
                  onScenarioCompleted={(scenarioId) => {
                    setScenariosCompleted((prev) => (prev.includes(scenarioId) ? prev : [...prev, scenarioId]));
                    emitSystemEvent(`${scenarioId} completed. ${t("disclaimers.nonAdvice")}`);
                  }}
                />
            </div>

            <div className={activeTab === "artifacts" ? "block space-y-3" : "hidden"} data-testid="workspace-artifacts-zone">
                <ArtifactBrowser artifacts={artifacts} selectedArtifactId={selectedArtifactId} onSelect={setSelectedArtifactId} />
                {selectedArtifact ? (
                  <Panel className="border-border bg-muted/30">
                    <SectionHeading title={selectedArtifact.title} subtitle={selectedArtifact.summary ?? t("emptyStates.noSelection")} />
                  </Panel>
                ) : (
                  <div className="rounded-md border border-dashed border-border/60 p-3 text-sm text-muted-foreground">
                    {t("emptyStates.noSelection")}
                  </div>
                )}
            </div>
          </Panel>

          {shortcutsOpen ? <KeyboardShortcutsHelp /> : null}

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
        </section>

        <aside className={workspaceContextColumnClass()}>
          <Panel>
            <SectionHeading title={t("runtime.contextSection")} subtitle={t("runtime.connectionSection")} />
          </Panel>

          <BackendConnectionCard
            state={connectionState}
            lastLiveIntegration={lastLiveIntegration}
            onRefresh={() => void checkConnection()}
          />

          <BackendCapabilitiesPanel report={capabilitiesReport} />

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

          <details className="rounded-lg border border-border bg-white p-3" open={false} data-testid="runtime-settings-collapsible">
            <summary className="cursor-pointer text-sm font-medium">{t("runtime.settingsTitle")}</summary>
            <div className="mt-3">
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
              {checkingConnection ? (
                <div className="mt-2">
                  <InlineFeedback tone="neutral" message={t("backend.checking")} />
                </div>
              ) : null}
            </div>
          </details>

          <details className="rounded-lg border border-border bg-white p-3" open={false} data-testid="capability-status-collapsible">
            <summary className="cursor-pointer text-sm font-medium">{t("backend.capabilitiesTitle")}</summary>
            <div className="mt-3">
              <CapabilityStatusList capabilities={capabilityMatrix} />
            </div>
          </details>

          <details className="rounded-lg border border-border bg-white p-3" open={false}>
            <summary className="cursor-pointer text-sm font-medium">{t("common.exportImport")}</summary>
            <div className="mt-3">
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
                  if (typeof window !== "undefined") {
                    const ok = window.confirm("Reset local workspace state?");
                    if (!ok) return;
                  }
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
            </div>
          </details>
        </aside>
      </div>
    </AppShell>
  );
}
