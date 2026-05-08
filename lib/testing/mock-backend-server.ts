import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { mockBackendResponses } from "@/lib/testing/mock-backend-fixtures";
import type { MockBackendRouteHit, MockBackendServerHandle } from "@/lib/testing/backend-harness-types";

type StartMockBackendServerOptions = {
  port?: number;
};

function nowIso() {
  return new Date().toISOString();
}

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += String(chunk);
    });
    req.on("end", () => {
      if (!raw.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });
  });
}

function sendJson(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(payload));
}

export async function startMockBackendServer(options: StartMockBackendServerOptions = {}): Promise<MockBackendServerHandle> {
  const hits: MockBackendRouteHit[] = [];

  const server = createServer(async (req, res) => {
    const method = req.method ?? "GET";
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    const path = url.pathname;

    const hit = (status: number) => {
      hits.push({ method, path, status, timestamp: nowIso() });
    };

    if (method === "GET" && path === "/health") {
      hit(200);
      sendJson(res, 200, mockBackendResponses.health);
      return;
    }

    if (method === "POST" && path === "/v1/research-runs") {
      await readJsonBody(req);
      hit(200);
      sendJson(res, 200, mockBackendResponses.researchRun);
      return;
    }

    if (method === "POST" && path === "/v1/reports/research") {
      await readJsonBody(req);
      hit(200);
      sendJson(res, 200, mockBackendResponses.report);
      return;
    }

    if (method === "POST" && path === "/v1/research-pipelines") {
      await readJsonBody(req);
      hit(200);
      sendJson(res, 200, mockBackendResponses.pipeline);
      return;
    }

    if (method === "POST" && path === "/v1/backtests") {
      await readJsonBody(req);
      hit(200);
      sendJson(res, 200, mockBackendResponses.backtest);
      return;
    }

    if (method === "POST" && path === "/v1/portfolio/review") {
      await readJsonBody(req);
      hit(200);
      sendJson(res, 200, mockBackendResponses.portfolioReview);
      return;
    }

    if (method === "POST" && path === "/v1/strategies/compare") {
      await readJsonBody(req);
      hit(200);
      sendJson(res, 200, mockBackendResponses.strategies);
      return;
    }

    if (method === "POST" && path === "/v1/evaluations/signals") {
      await readJsonBody(req);
      hit(200);
      sendJson(res, 200, mockBackendResponses.signals);
      return;
    }

    if (method === "GET" && path === "/v1/system/storage") {
      hit(200);
      sendJson(res, 200, mockBackendResponses.systemStorage);
      return;
    }

    if (method === "GET" && path === "/v1/system/provider") {
      hit(200);
      sendJson(res, 200, mockBackendResponses.systemProvider);
      return;
    }

    if (method === "GET" && path === "/v1/provider/conformance") {
      hit(200);
      sendJson(res, 200, mockBackendResponses.conformance);
      return;
    }

    hit(404);
    sendJson(res, 404, {
      error: "not_found",
      path,
      method,
      metadata: mockBackendResponses.health.metadata,
    });
  });

  await new Promise<void>((resolve) => {
    server.listen(options.port ?? 0, "127.0.0.1", () => resolve());
  });

  const address = server.address();
  const port = typeof address === "object" && address ? address.port : options.port ?? 0;
  const baseUrl = `http://127.0.0.1:${port}`;

  return {
    port,
    baseUrl,
    close: async () => {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      });
    },
    getHits: () => [...hits],
  };
}
