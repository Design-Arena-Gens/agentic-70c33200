"use client";

import { useMemo, useState } from "react";
import { autoForge, type AutoForgeResult } from "./lib/autoForge";

type ClipboardState = {
  prompt: "idle" | "copied" | "error";
  caption: "idle" | "copied" | "error";
};

const INITIAL_CLIPBOARD_STATE: ClipboardState = {
  prompt: "idle",
  caption: "idle"
};

export default function HomePage() {
  const [idea, setIdea] = useState("");
  const [generated, setGenerated] = useState<AutoForgeResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [clipboardState, setClipboardState] = useState<ClipboardState>(INITIAL_CLIPBOARD_STATE);

  const isDisabled = idea.trim().length === 0 || isGenerating;

  const handleGenerate = () => {
    setIsGenerating(true);
    try {
      const result = autoForge(idea);
      setGenerated(result);
      setClipboardState(INITIAL_CLIPBOARD_STATE);
    } finally {
      setIsGenerating(false);
    }
  };

  const promptText = useMemo(() => generated?.prompt.formatted ?? "", [generated]);
  const captionText = useMemo(() => generated?.copywriting.caption ?? "", [generated]);

  const copyToClipboard = async (value: string, key: keyof ClipboardState) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setClipboardState((prev) => ({
        ...prev,
        [key]: "copied"
      }));
      setTimeout(() => {
        setClipboardState((prev) => ({
          ...prev,
          [key]: "idle"
        }));
      }, 2000);
    } catch (error) {
      setClipboardState((prev) => ({
        ...prev,
        [key]: "error"
      }));
    }
  };

  return (
    <main className="app-shell">
      <section className="glass-card">
        <span className="pill">AutoForge v1.0</span>
        <h1 style={{ fontSize: "40px", fontWeight: 800, marginTop: 16, lineHeight: 1.1 }}>
          <span className="gradient-text">AutoForge</span> turns any idea into a cinematic,
          publish-ready drop.
        </h1>
        <p style={{ color: "#cbd5f5", marginTop: 16, lineHeight: 1.6 }}>
          Paste a voice note or concept. AutoForge breaks it down, engineers the perfect AI-ready
          prompt, and delivers a copywriting package fit for immediate release.
        </p>

        <div style={{ marginTop: 32, display: "grid", gap: 20 }}>
          <label htmlFor="idea-input" style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 14 }}>
            Idea Input
          </label>
          <textarea
            id="idea-input"
            placeholder="Example: A motivating video for Gen Z founders launching new AI-driven wellness apps..."
            value={idea}
            onChange={(event) => setIdea(event.target.value)}
            rows={6}
            style={{
              resize: "vertical",
              padding: 20,
              borderRadius: 18,
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid rgba(148, 163, 184, 0.35)",
              color: "#f8fafc",
              fontSize: 16,
              lineHeight: 1.6,
              boxShadow: "inset 0 8px 24px rgba(15, 23, 42, 0.35)"
            }}
          />
          <button className="primary-button" disabled={isDisabled} onClick={handleGenerate}>
            {isGenerating ? "Forging..." : "Forge Content Package"}
          </button>
        </div>
      </section>

      {generated ? (
        <section className="grid">
          <div className="glass-card">
            <div className="pill">Step 1 · Interpret</div>
            <h2 className="section-title">Idea Intelligence Breakdown</h2>
            <p className="section-description">
              AutoForge reverse-engineers the tone, audience, platform, and mood to craft the
              perfect production blueprint.
            </p>

            <div className="grid two">
              <div className="result-block">
                <div className="result-title">Idea Essence</div>
                <p className="result-content">{generated.interpretation.ideaSummary}</p>
              </div>
              <div className="result-block">
                <div className="result-title">Audience Target</div>
                <p className="result-content">{generated.interpretation.audience}</p>
              </div>
              <div className="result-block">
                <div className="result-title">Tone & Mood</div>
                <p className="result-content">
                  {capitalizeSentence(generated.interpretation.tone)} ·{" "}
                  {capitalizeSentence(generated.interpretation.mood)}
                </p>
              </div>
              <div className="result-block">
                <div className="result-title">Content Type & Platform</div>
                <p className="result-content">
                  {capitalizeSentence(generated.interpretation.contentType)} ·{" "}
                  {generated.interpretation.platform}
                </p>
              </div>
            </div>

            <div className="chip-row">
              {generated.interpretation.keywords.map((keyword) => (
                <span key={keyword} className="chip">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="glass-card">
            <div className="pill">Step 2 · Prompt</div>
            <h2 className="section-title">Cinematic Prompt Blueprint</h2>
            <p className="section-description">
              Plug this into Veo, Runway, Pika, Leonardo, or any AI video engine for instant magic.
            </p>

            <div className="result-block">
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  fontFamily: "Menlo, monospace",
                  color: "#e2e8f0",
                  fontSize: 15,
                  margin: 0
                }}
              >
                {promptText}
              </pre>
              <button
                className="copy-button"
                type="button"
                onClick={() => copyToClipboard(promptText, "prompt")}
              >
                {clipboardState.prompt === "copied"
                  ? "✓ Copied prompt"
                  : clipboardState.prompt === "error"
                    ? "⚠️ Copy failed"
                    : "Copy prompt"}
              </button>
            </div>

            <div className="grid two" style={{ marginTop: 24 }}>
              {Object.entries(generated.prompt.pieces).map(([key, value]) => (
                <div key={key} className="result-block">
                  <div className="result-title">{toLabel(key)}</div>
                  <p className="result-content">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card">
            <div className="pill">Step 3 · Copywriting</div>
            <h2 className="section-title">Publish-Ready Content Pack</h2>
            <p className="section-description">
              Drop this directly into your scheduler. Script beats, captions, and CTA tuned for the
              target platform.
            </p>

            <div className="grid two">
              <div className="result-block">
                <div className="result-title">Headline</div>
                <p className="result-content">{generated.copywriting.headline}</p>
              </div>
              <div className="result-block">
                <div className="result-title">Hook</div>
                <p className="result-content">{generated.copywriting.hook}</p>
              </div>
              <div className="result-block">
                <div className="result-title">Narrative Summary</div>
                <p className="result-content">{generated.copywriting.narrative}</p>
              </div>
              <div className="result-block">
                <div className="result-title">Platform Note</div>
                <p className="result-content">{generated.copywriting.platformNote}</p>
              </div>
            </div>

            <div className="result-block" style={{ marginTop: 16 }}>
              <div className="result-title">Script Beats</div>
              <ol className="result-list">
                {generated.copywriting.scriptBeats.map((beat, index) => (
                  <li key={index}>{beat}</li>
                ))}
              </ol>
            </div>

            <div className="result-block" style={{ marginTop: 16 }}>
              <div className="result-title">Caption</div>
              <p className="result-content">{generated.copywriting.caption}</p>
              <button
                className="copy-button"
                type="button"
                onClick={() => copyToClipboard(captionText, "caption")}
              >
                {clipboardState.caption === "copied"
                  ? "✓ Copied caption"
                  : clipboardState.caption === "error"
                    ? "⚠️ Copy failed"
                    : "Copy caption"}
              </button>
            </div>

            <div className="result-block" style={{ marginTop: 16 }}>
              <div className="result-title">Hashtags</div>
              <p className="result-content">{generated.copywriting.hashtags.join(" ")}</p>
            </div>

            <div className="result-block" style={{ marginTop: 16 }}>
              <div className="result-title">CTA</div>
              <p className="result-content">{generated.copywriting.cta}</p>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

function toLabel(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
}

function capitalizeSentence(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
