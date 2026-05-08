import "@testing-library/jest-dom";
import { beforeEach, vi } from "vitest";

beforeEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});
