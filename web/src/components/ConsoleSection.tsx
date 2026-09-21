"use client";

import { FormEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";

type Line = { id: number; text: string; cls: string };

let lineId = 0;
const nextId = () => ++lineId;

const HELP_TEXT =
  "available: help · whoami · resume · projects · contact · status · clear — anything else goes to the AI agent (reads the real repo)";

export default function ConsoleSection() {
  const [lines, setLines] = useState<Line[]>([
    {
      id: nextId(),
      text: "type help to see what this can do — free text is answered by an AI agent with read-only access to github.com/jivagrisma",
      cls: "",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const history = useRef<string[]>([]);
  const historyIndex = useRef(-1);
  const bodyRef = useRef<HTMLDivElement>(null);

  const addLine = useCallback((text: string, cls = "") => {
    setLines((prev) => [...prev.slice(-100), { id: nextId(), text, cls }]);
  }, []);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const localCommand = async (raw: string): Promise<boolean> => {
    const key = raw.toLowerCase().trim();
    switch (key) {
      case "help":
        addLine(HELP_TEXT);
        return true;
      case "clear":
        setLines([]);
        return true;
      case "whoami":
        addLine("jorge — founder, CTO & AI agent architect. Jardín/Medellín, Colombia.");
        scrollToSection("boot");
        return true;
      case "resume":
      case "cv":
        addLine("Giroplay S.A.S. (2019–present) — Co-Founder & CTO");
        addLine("Agrosurkapital LLC (2021–present) — Head of AI Engineering");
        addLine("CESDE (2022–2025) — Adjunct Professor, Software Development");
        addLine("type download cv for the full PDF");
        scrollToSection("career");
        return true;
      case "download cv": {
        const a = document.createElement("a");
        a.href = "/cv-jorge-grisales.pdf";
        a.download = "";
        a.click();
        addLine("downloading cv-jorge-grisales.pdf...");
        return true;
      }
      case "projects":
        addLine("viajemos.co (+android app), giroplay.online, agrosurkapital.online, motos-web, esic-fabrica-ia, waia");
        scrollToSection("projects");
        return true;
      case "contact":
        addLine("jivagris1989@gmail.com · github.com/jivagrisma · linkedin.com/in/ivangrisales");
        return true;
      case "status": {
        try {
          const res = await fetch("/api/status", { cache: "no-store" });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const s = (await res.json()) as Record<string, string>;
          addLine(
            `repo: ${s.repo ?? "?"} · branch: ${s.branch ?? "?"} · last commit: ${(s.lastCommitSha ?? "…").slice(0, 7)} ${s.lastCommitMsg ?? ""} · ci: ${s.ciState ?? "unknown"}`,
          );
        } catch (err) {
          addLine(`status unavailable: ${err instanceof Error ? err.message : "error"}`, "err");
        }
        return true;
      }
      default:
        return false;
    }
  };

  const askAgent = async (question: string) => {
    setBusy(true);
    const lineIdStream = nextId();
    setLines((prev) => [...prev, { id: lineIdStream, text: "", cls: "echo streaming" }]);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });
      if (!res.ok || !res.body) {
        throw new Error(`agent unavailable (HTTP ${res.status})`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const event of chunk.split("\n\n")) {
          const dataLine = event
            .split("\n")
            .find((l) => l.startsWith("data:"));
          if (!dataLine) continue;
          const payload = dataLine.slice(5).trim();
          if (payload === "[DONE]") continue;
          try {
            const obj = JSON.parse(payload);
            if (obj.error) throw new Error(obj.error);
            if (obj.delta) {
              acc += obj.delta;
              setLines((prev) =>
                prev.map((l) =>
                  l.id === lineIdStream ? { ...l, text: acc, cls: "echo streaming" } : l,
                ),
              );
            }
          } catch {
            /* fragmento incompleto del stream: se ignora */
          }
        }
      }
      setLines((prev) =>
        prev.map((l) => (l.id === lineIdStream ? { ...l, text: acc, cls: "echo" } : l)),
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown error";
      setLines((prev) =>
        prev.map((l) =>
          l.id === lineIdStream
            ? { ...l, text: `agent offline: ${msg}`, cls: "err" }
            : l,
        ),
      );
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const raw = input.trim();
    if (!raw || busy) return;
    addLine(`> ${raw}`, "echo");
    history.current.push(raw);
    historyIndex.current = history.current.length;
    setInput("");
    if (!(await localCommand(raw))) {
      void askAgent(raw);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      if (historyIndex.current > 0) {
        historyIndex.current -= 1;
        setInput(history.current[historyIndex.current] ?? "");
      }
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      if (historyIndex.current < history.current.length) {
        historyIndex.current += 1;
        setInput(history.current[historyIndex.current] ?? "");
      }
      e.preventDefault();
    }
  };

  return (
    <section id="ask">
      <div className="cmd-line">
        <span className="prompt">$</span> ./agent --interactive
      </div>
      <div className="console">
        <div className="console-body" ref={bodyRef} aria-live="polite">
          {lines.map((l) => (
            <div key={l.id} className={`console-line ${l.cls}`}>
              {l.text}
            </div>
          ))}
        </div>
        <form className="console-form" onSubmit={onSubmit}>
          <span className="prompt">&gt;</span>
          <input
            type="text"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder={busy ? "agent is thinking..." : "ask anything about jorge's work — or type help"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={busy}
            aria-label="console input"
          />
        </form>
      </div>
      <p className="hint">
        try: help · whoami · projects · status — or free text, e.g. “what was the last commit in
        motos-y-servicios-ia?”
      </p>
    </section>
  );
}
