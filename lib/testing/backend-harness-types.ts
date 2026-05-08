export type HarnessMockMeta = {
  provider: "mock";
  dataType: "synthetic_mock";
  notFinancialAdvice: true;
  noTradingExecution: true;
};

export type MockBackendRouteHit = {
  method: string;
  path: string;
  status: number;
  timestamp: string;
};

export type MockBackendServerHandle = {
  port: number;
  baseUrl: string;
  close: () => Promise<void>;
  getHits: () => MockBackendRouteHit[];
};

export type BackendHarnessReport = {
  checkedAt: string;
  passed: boolean;
  baseUrl: string;
  checks: Array<{
    name: string;
    passed: boolean;
    details?: string;
  }>;
  routeHits: MockBackendRouteHit[];
  warnings: string[];
};
