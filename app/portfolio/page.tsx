import portfolioReviewDemo from "@/fixtures/demo/portfolio-review-2330-watchlist.json";
import { PortfolioReviewPanel } from "@/components/portfolio/portfolio-review-panel";

export default function PortfolioPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-4 p-6" data-testid="portfolio-page">
      <h1 className="text-xl font-semibold">Portfolio Research</h1>
      <p className="text-sm text-muted-foreground">
        Portfolio review in this workspace is a research simulation target view only. It does not place orders, execute trades, or connect to brokers.
      </p>
      <PortfolioReviewPanel review={portfolioReviewDemo as any} />
      <div className="rounded border p-3 text-xs text-muted-foreground">mock/synthetic/non-advice output with backend optional fallback.</div>
    </main>
  );
}
