import type { PortfolioReview, PositionTarget } from "@/lib/schemas/strategies";
import { PositionTargetsTable } from "@/components/portfolio/position-targets-table";
import { RebalancePlanView } from "@/components/portfolio/rebalance-plan-view";
import { PortfolioRiskSummary } from "@/components/portfolio/portfolio-risk-summary";

function toTargets(review: PortfolioReview): PositionTarget[] {
  const entries = Object.entries(review.targetWeights ?? {});
  return entries.map(([ticker, weight]) => ({
    ticker,
    targetWeight: Number(weight),
    currentWeight: 0,
    changeWeight: Number(weight),
    riskFlags: [],
    reason: "Synthetic target allocation",
  }));
}

export function PortfolioReviewPanel({ review }: { review: PortfolioReview }) {
  return (
    <div className="space-y-3" data-testid="portfolio-review-panel">
      <div className="rounded border p-3 text-xs text-muted-foreground">
        Portfolio review displays research simulation targets only. This workspace does not place orders or execute trades.
      </div>
      <div className="rounded border p-3 text-xs">
        <div className="font-medium">Portfolio Review</div>
        <div className="text-muted-foreground">As-of {review.asOfDate}</div>
        <div className="text-muted-foreground">Cash {(review.cashWeight * 100).toFixed(1)}%</div>
      </div>
      <PositionTargetsTable targets={toTargets(review)} />
      <RebalancePlanView plan={review.rebalancePlan} />
      <PortfolioRiskSummary summary={review.rebalancePlan.riskSummary} />
    </div>
  );
}
