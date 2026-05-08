import { adaptPipelineToPlannerTrace, adaptReportToSections, adaptStrategyComparisonToTable, adaptSignalEvaluationToExplorer } from "@/lib/api/adapters";
import { withHarnessMeta } from "@/lib/testing/mock-backend-fixtures";

export type ArtifactMetadataCheck = {
  file: string;
  passed: boolean;
  issues: string[];
};

function valueAt(obj: unknown, key: string) {
  if (!obj || typeof obj !== "object") return undefined;
  return (obj as Record<string, unknown>)[key];
}

export function checkArtifactMetadata(file: string, json: unknown): ArtifactMetadataCheck {
  const issues: string[] = [];
  const metadata = valueAt(json, "metadata");

  if (!metadata || typeof metadata !== "object") {
    issues.push("missing metadata object");
  } else {
    const provider = valueAt(metadata, "provider");
    if (provider !== "mock") {
      issues.push("metadata.provider must be mock");
    }

    const dataType = valueAt(metadata, "dataType") ?? valueAt(metadata, "data_type");
    if (dataType !== "synthetic_mock") {
      issues.push("metadata.dataType/data_type must be synthetic_mock");
    }

    if (valueAt(metadata, "notFinancialAdvice") !== true) {
      issues.push("metadata.notFinancialAdvice must be true");
    }

    if (valueAt(metadata, "noTradingExecution") !== true) {
      issues.push("metadata.noTradingExecution must be true");
    }
  }

  return {
    file,
    passed: issues.length === 0,
    issues,
  };
}

export function checkAdapterCompatibility(input: {
  report?: unknown;
  pipeline?: unknown;
  signal?: unknown;
  strategy?: unknown;
}) {
  const issues: string[] = [];

  try {
    if (input.report) {
      adaptReportToSections(input.report);
    }
  } catch (error) {
    issues.push(`report adapter failed: ${error instanceof Error ? error.message : "unknown"}`);
  }

  try {
    if (input.pipeline) {
      adaptPipelineToPlannerTrace(withHarnessMeta(input.pipeline as Record<string, unknown>));
    }
  } catch (error) {
    issues.push(`pipeline adapter failed: ${error instanceof Error ? error.message : "unknown"}`);
  }

  try {
    if (input.signal) {
      adaptSignalEvaluationToExplorer(withHarnessMeta(input.signal as Record<string, unknown>));
    }
  } catch (error) {
    issues.push(`signal adapter failed: ${error instanceof Error ? error.message : "unknown"}`);
  }

  try {
    if (input.strategy) {
      adaptStrategyComparisonToTable(withHarnessMeta(input.strategy as Record<string, unknown>));
    }
  } catch (error) {
    issues.push(`strategy adapter failed: ${error instanceof Error ? error.message : "unknown"}`);
  }

  return {
    passed: issues.length === 0,
    issues,
  };
}
