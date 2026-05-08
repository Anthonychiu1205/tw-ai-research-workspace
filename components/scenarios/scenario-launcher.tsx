"use client";

import { useState } from "react";
import { listScenarios } from "@/lib/scenarios/scenario-registry";
import { runScenario } from "@/lib/scenarios/scenario-runner";
import type { ArtifactStoreApi } from "@/lib/artifacts/artifact-store";
import type { ScenarioRunResult, WorkspaceScenarioId } from "@/lib/scenarios/scenario-types";
import { ScenarioCard } from "@/components/scenarios/scenario-card";
import { ScenarioStepper } from "@/components/scenarios/scenario-stepper";
import { ScenarioResultPanel } from "@/components/scenarios/scenario-result-panel";
import { ScenarioProgress } from "@/components/scenarios/scenario-progress";
import { SectionHeading } from "@/components/ui/section-heading";
import { useI18n } from "@/lib/i18n/use-i18n";

export function ScenarioLauncher({
  artifactStore,
  onScenarioMessage,
  onArtifactCreated,
  onScenarioCompleted,
}: {
  artifactStore: ArtifactStoreApi;
  onScenarioMessage?: (message: string) => void;
  onArtifactCreated?: (artifactId: string) => void;
  onScenarioCompleted?: (scenarioId: WorkspaceScenarioId) => void;
}) {
  const { t } = useI18n();
  const [runningScenarioId, setRunningScenarioId] = useState<WorkspaceScenarioId | null>(null);
  const [result, setResult] = useState<ScenarioRunResult | null>(null);

  const scenarios = listScenarios();

  const run = async (scenarioId: WorkspaceScenarioId) => {
    setRunningScenarioId(scenarioId);
    const nextResult = await runScenario({
      scenarioId,
      artifactStore,
      onMessage: onScenarioMessage,
      onArtifactCreated,
    });
    setResult(nextResult);
    if (nextResult.status === "succeeded") {
      onScenarioCompleted?.(scenarioId);
    }
    setRunningScenarioId(null);
  };

  return (
    <div className="space-y-3" data-testid="scenario-launcher">
      <SectionHeading title={t("scenarios.guidedTitle")} subtitle={t("scenarios.guidedSubtitle")} />
      <div className="grid gap-2 md:grid-cols-2">
        {scenarios.map((scenario) => (
          <ScenarioCard key={scenario.id} scenario={scenario} running={Boolean(runningScenarioId)} onRun={run} />
        ))}
      </div>
      <ScenarioProgress steps={result?.steps ?? []} />
      <details className="rounded-lg border border-border/70 bg-background/20 p-3" open={false}>
        <summary className="cursor-pointer text-sm font-medium">{t("scenarios.steps")}</summary>
        <div className="mt-2">
          <ScenarioStepper steps={result?.steps ?? []} />
        </div>
      </details>
      <ScenarioResultPanel result={result} onOpenArtifact={onArtifactCreated} />
    </div>
  );
}
