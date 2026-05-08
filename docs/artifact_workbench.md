# Artifact Workbench

v0.5 artifact workbench supports demo inspection and sharing.

Features:
- filterable browser
- metadata + lineage
- JSON viewer/actions
- pin/unpin
- share bundle participation

All artifacts carry mock/synthetic/non-advice/no-trading metadata.

v0.8 adds:
- `portfolio_review`
- `rebalance_plan`
- `backtest_v2_summary`

v0.9 adds UX reliability polish:
- clearer "open research output" activation affordance
- active artifact selection feedback in browser list
- context panel consistently updates when artifact is selected
- metadata remains explicit for `source`, `synthetic`, `notFinancialAdvice`, `noTradingExecution`

v1.0 candidate polish:
- semantic-first artifact detail readability (report/trace/strategy/portfolio/backtest summaries)
- `Raw JSON` moved into collapsed secondary section
- empty-state guidance now points users to run scenarios/operations first
