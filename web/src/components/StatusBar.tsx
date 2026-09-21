"use client";

import { useEffect, useState } from "react";

type Status = {
  branch?: string;
  lastCommitSha?: string;
  lastCommitMsg?: string;
  ciState?: "success" | "failure" | "pending" | "unknown";
  repo?: string;
  region?: string;
};

const ciLabel: Record<string, { text: string; cls: string }> = {
  success: { text: "● passing", cls: "ok" },
  failure: { text: "● failing", cls: "fail" },
  pending: { text: "● running", cls: "" },
  unknown: { text: "● unknown", cls: "" },
};

export default function StatusBar() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch("/api/status", { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as Status;
          if (alive) setStatus(data);
        }
      } catch {
        /* backend unreachable: placeholder stays */
      }
    };
    void load();
    const t = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const ci = ciLabel[status?.ciState ?? "unknown"];
  const shortSha = status?.lastCommitSha?.slice(0, 7) ?? "…";

  return (
    <div className="statusbar" role="status">
      <span>
        repo: <b>{status?.repo ?? "connecting…"}</b>
      </span>
      <span>
        branch: <b>{status?.branch ?? "…"}</b>
      </span>
      <span>
        last commit: <b>{`${shortSha} ${status?.lastCommitMsg?.slice(0, 40) ?? "…"}`}</b>
      </span>
      <span>
        ci: <span className={ci.cls}>{ci.text}</span>
      </span>
      <span>
        region: <b>{status?.region ?? "gcp:us-central1"}</b>
      </span>
    </div>
  );
}
