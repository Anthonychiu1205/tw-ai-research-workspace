import type { RebalancePlan } from "@/lib/schemas/strategies";

export function RebalancePlanView({ plan }: { plan: RebalancePlan }) {
  return (
    <div className="rounded border p-3" data-testid="rebalance-plan-view">
      <div className="text-xs font-medium">Rebalance Plan</div>
      <div className="mt-1 text-[11px] text-muted-foreground">
        Research simulation only, not orders or trade execution.
      </div>
      <div className="mt-2 space-y-1 text-xs">
        <div>Plan ID: {plan.planId}</div>
        <div>As-of: {plan.asOfDate}</div>
        <div>Cash: {(plan.cashWeight * 100).toFixed(1)}%</div>
        <div>Turnover: {((plan.turnoverEstimate ?? 0) * 100).toFixed(1)}%</div>
      </div>
      <div className="mt-2 space-y-1 text-xs">
        {plan.decisions.map((decision) => (
          <div key={`${decision.ticker}-${decision.action}`} className="rounded border border-border/60 p-2">
            <div>
              {decision.ticker} · {decision.action}
            </div>
            <div className="text-muted-foreground">
              {(decision.fromWeight * 100).toFixed(1)}% → {(decision.toWeight * 100).toFixed(1)}%
            </div>
            {decision.reason ? <div className="text-muted-foreground">{decision.reason}</div> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
