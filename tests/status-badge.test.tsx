import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { StatusBadge } from "@/components/ui/status-badge";

describe("status badge", () => {
  test("all tones render", () => {
    const tones = [
      "neutral",
      "backend",
      "evidence",
      "trace",
      "success",
      "warning",
      "danger",
      "mock",
    ] as const;

    render(
      <div>
        {tones.map((tone) => (
          <StatusBadge key={tone} tone={tone}>
            {tone}
          </StatusBadge>
        ))}
      </div>,
    );

    tones.forEach((tone) => {
      expect(screen.getByText(tone)).toBeInTheDocument();
    });
  });

  test("no unsafe text", () => {
    render(<StatusBadge tone="warning">synthetic / non-advice</StatusBadge>);
    expect(screen.queryByText(/buy recommendation|sell recommendation|guaranteed returns/i)).not.toBeInTheDocument();
  });
});
