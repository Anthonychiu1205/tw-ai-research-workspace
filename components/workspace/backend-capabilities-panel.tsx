import type { BackendCapabilitiesReport } from "@/lib/api/capabilities";
import { Badge } from "@/components/ui/badge";

export function BackendCapabilitiesPanel({ report }: { report: BackendCapabilitiesReport }) {
  return (
    <div className="space-y-2 rounded-md border p-3" data-testid="backend-capabilities-panel">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Backend Capabilities</div>
        <Badge>{report.mode}</Badge>
      </div>
      <div className="text-xs text-muted-foreground">base: {report.baseUrl}</div>
      <div className="text-xs">reachable: {report.reachable ? "yes" : "no"}</div>
      {report.fallbackActive ? <div className="text-xs text-yellow-400">fallback to mock active</div> : null}
      {report.warnings.map((warning) => (
        <div key={warning} className="rounded border border-yellow-500/30 bg-yellow-500/10 p-2 text-xs">
          {warning}
        </div>
      ))}
      <div className="space-y-1">
        {report.capabilities.map((capability) => (
          <div key={capability.id} className="flex items-center justify-between rounded border p-2 text-xs">
            <div>
              <div>{capability.label}</div>
              <div className="text-muted-foreground">{capability.method} {capability.endpoint}</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge>{capability.category}</Badge>
              <Badge>{capability.available ? "available" : "unavailable"}</Badge>
            </div>
          </div>
        ))}
      </div>
      {report.missing.length > 0 ? (
        <div className="text-xs text-yellow-300">missing: {report.missing.join(", ")}</div>
      ) : null}
    </div>
  );
}
