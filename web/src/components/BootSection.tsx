"use client";

import { useEffect, useRef, useState } from "react";

const bootLines: { text: string; cls: string }[] = [
  { text: "jorge — founder, CTO & AI agent architect", cls: "" },
  { text: "7+ years shipping cloud-native platforms on AWS & GCP", cls: "muted" },
  {
    text: "co-founder & CTO, Giroplay S.A.S. — payment infrastructure, 99.9% uptime",
    cls: "",
  },
  {
    text: "co-founder & Head of AI Engineering, Agrosurkapital LLC — autonomous agents, LLM orchestration",
    cls: "",
  },
  { text: "adjunct professor, CESDE — mentored 200+ engineers", cls: "" },
  { text: "this terminal is alive: the agent below reads the real repo via MCP", cls: "accent" },
];

export default function BootSection() {
  const [visible, setVisible] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let i = 0;
    const next = () => {
      i += 1;
      setVisible(i);
      if (i < bootLines.length) timer.current = setTimeout(next, reduce ? 0 : 220);
    };
    timer.current = setTimeout(next, reduce ? 0 : 220);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (
    <section id="boot">
      <div className="cmd-line">
        <span className="prompt">$</span> whoami
      </div>
      <div className="out">
        {bootLines.slice(0, visible).map((l, i) => (
          <p key={i} className={l.cls}>
            {l.text}
          </p>
        ))}
        {visible < bootLines.length && <span className="caret" aria-hidden />}
      </div>
    </section>
  );
}
