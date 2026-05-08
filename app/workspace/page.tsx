"use client";

import { useEffect, useMemo, useState } from "react";
import sessionDemo from "@/fixtures/demo/session-demo.json";
import { AppShell } from "@/components/app-shell/app-shell";
import { CommandMenu } from "@/components/app-shell/command-menu";
import { ResearchChat } from "@/components/chat/research-chat";
import { SessionHistory } from "@/components/workspace/session-history";
import { ArtifactBrowser } from "@/components/workspace/artifact-browser";
import { ArtifactDetailPanel } from "@/components/workspace/artifact-detail-panel";
import { WorkspaceContextPanel } from "@/components/workspace/workspace-context-panel";
import { ResearchOperationPanel } from "@/components/operations/research-operation-panel";
import { BackendConnectionCard } from "@/components/workspace/backend-connection-card";
import { RuntimeSettingsPanel } from "@/components/workspace/runtime-settings-panel";
import { WorkspaceExportActions } from "@/components/workspace/workspace-export-actions";
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
import type { BackendConnectionState, WorkspaceSession } from "@/lib/schemas/workspace";

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

export default function WorkspacePage() {
  const sessionStore = useMemo(() => createSessionStore(seedSessions()), []);
  const artifactStore = useMemo(() => createArtifactStore(), []);
  const [sessions, setSessions] = useState(() => sessionStore.list());
  const [artifacts, setArtifacts] = useState(() => artifactStore.listAll());
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(sessions[0]?.id ?? null);
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);
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

  const refreshSessions = () => setSessions(sessionStore.list());
  const refreshArtifacts = () => setArtifacts(artifactStore.listAll());

  const selectedArtifact = artifacts.find((artifact) => artifact.id === selectedArtifactId);
  const modelOptions = getModelOptions();

  const checkConnection = async () => {
    const next = await buildBackendConnectionState(runtimeSettings);
    setConnectionState(next);
  };

  useEffect(() => {
    void checkConnection();
  }, [runtimeSettings.mode, runtimeSettings.apiBaseUrl]);

  const applySettings = (patch: Partial<typeof runtimeSettings>) => {
    const next = persistRuntimeSettings({ ...runtimeSettings, ...patch });
    setRuntimeSettings(next);
  };

  const commands = getWorkspaceCommands({ canUseApiMode: connectionState.reachable });

  return (
    <AppShell
      sessions={sessions.map((session) => ({ id: session.id, title: session.title }))}
      artifacts={artifacts.map((artifact) => ({ id: artifact.id, title: artifact.title }))}
      backendStatus={connectionState.reachable ? "ok" : "optional"}
      mode={runtimeSettings.mode}
      modelLabel={runtimeSettings.selectedModel}
      connection={connectionState}
      onQuickAnalyze={async () => {
        const result = await runResearchOperation(createDefaultOperationRequest("run_research"), artifactStore);
        if (result.artifactIds[0]) setSelectedArtifactId(result.artifactIds[0]);
        refreshArtifacts();
      }}
    >
      <div className="grid h-full grid-cols-12 gap-4" data-testid="workspace-page-grid">
        <aside className="col-span-3 min-h-0 space-y-3 overflow-auto">
          <SessionHistory
            sessions={sessions.map((session) => ({ id: session.id, title: session.title }))}
            selectedSessionId={selectedSessionId}
            onCreate={() => {
              const session = sessionStore.create("Local Workspace Session");
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
            onRun={async (command) => {
              await command.run({
                canUseApiMode: connectionState.reachable,
                enqueueOperation: async (request) => {
                  const result = await runResearchOperation(request, artifactStore);
                  if (result.artifactIds[0]) setSelectedArtifactId(result.artifactIds[0]);
                  refreshArtifacts();
                  return result;
                },
                navigate: (path) => {
                  if (typeof window !== "undefined") {
                    window.location.hash = path.replace("#", "");
                  }
                },
                setRuntimeMode: (mode) => applySettings({ mode }),
                checkBackendHealth: checkConnection,
              });
            }}
          />
        </aside>

        <section className="col-span-6 min-h-0 space-y-3 overflow-auto">
          <ResearchChat runtimeSettings={runtimeSettings} connectionState={connectionState} onRuntimeSettingsChange={applySettings} />
          <ResearchOperationPanel
            artifactStore={artifactStore}
            onArtifactCreated={(id) => {
              setSelectedArtifactId(id);
              refreshArtifacts();
            }}
          />
        </section>

        <aside className="col-span-3 min-h-0 space-y-3 overflow-auto">
          <BackendConnectionCard state={connectionState} onRefresh={() => void checkConnection()} />
          <RuntimeSettingsPanel
            settings={runtimeSettings}
            models={modelOptions}
            providerUnavailableReason={getProviderUnavailableReason(runtimeSettings.selectedProvider)}
            onChange={applySettings}
            onReset={() => {
              const defaults = resetRuntimeSettings();
              setRuntimeSettings(defaults);
            }}
            onCheckBackend={() => void checkConnection()}
          />

          <WorkspaceExportActions
            sessions={sessions}
            artifacts={artifacts}
            runtimeSettings={runtimeSettings}
            onImport={({ sessions: importedSessions, artifacts: importedArtifacts, runtimeSettings: importedSettings }) => {
              sessionStore.clear();
              importedSessions.forEach((session) => sessionStore.upsert(session));
              artifactStore.clear();
              artifactStore.importJson(JSON.stringify(importedArtifacts));
              setRuntimeSettings(importedSettings);
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
