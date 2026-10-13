"use client";
import { useEffect, useMemo, useState } from "react";
import Track from "../components/Track";
import { METHODS, PHASES, PHASE_ORDER, SYMPTOMS, byId } from "../lib/methods";

export default function Home() {
  const [tab, setTab] = useState("library");
  const [phase, setPhase] = useState(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(null); // method id
  const [ddOpen, setDdOpen] = useState(false);
  const [marker, setMarker] = useState(null);

  // Show the double diamond explainer once, on first visit.
  useEffect(() => {
    try {
      if (!localStorage.getItem("seen-dd")) {
        setDdOpen(true);
        localStorage.setItem("seen-dd", "1");
      }
    } catch {}
  }, []);

  return (
    <main>
      <header className="top">
        <div>
          <p className="kicker">BCII method library &amp; project assistant</p>
          <h1>The BCII Rollercoaster</h1>
          <p className="lede">
            Every project has climbs, drops and loops. Find where your team is on the ride, then pick a
            method to get moving again, including ones you haven't tried yet.
          </p>
        </div>
        <button className="ghost" onClick={() => setDdOpen(true)}>
          New to the double diamond?
        </button>
      </header>

      <section className="ride">
        <h2>Where are you on the ride?</h2>
        <p className="muted">Tap a stage to see its methods.</p>
        <Track active={phase} onPick={(p) => { setPhase(p); setTab("library"); }} marker={marker} />
        {phase && phase !== "frameworks" && (
          <p className="phase-note" style={{ borderColor: PHASES[phase].colour }}>
            <strong style={{ color: PHASES[phase].colour }}>
              {PHASES[phase].label}, {PHASES[phase].ride}.
            </strong>{" "}
            {PHASES[phase].short}
          </p>
        )}
      </section>

      <nav className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === "library"} onClick={() => setTab("library")}>
          Method library
        </button>
        <button role="tab" aria-selected={tab === "assistant"} onClick={() => setTab("assistant")}>
          Stuck? Ask the assistant
        </button>
      </nav>

      {tab === "library" ? (
        <Library phase={phase} setPhase={setPhase} query={query} setQuery={setQuery} onOpen={setOpen} />
      ) : (
        <Assistant onOpen={setOpen} setMarker={setMarker} />
      )}

      <footer>
        Built by BCII students for BCII students. Method guidance is a starting point: adapt it to your
        project and check with your tutor.
      </footer>

      {open && <MethodDetail id={open} onOpen={setOpen} onClose={() => setOpen(null)} />}
      {ddOpen && <DoubleDiamond onClose={() => setDdOpen(false)} />}
    </main>
  );
}

/* ---------------- Library ---------------- */

function Library({ phase, setPhase, query, setQuery, onOpen }) {
  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      METHODS.filter(
        (m) =>
          (!phase || m.phases.includes(phase)) &&
          (!q || (m.name + " " + m.summary + " " + m.when).toLowerCase().includes(q))
      ),
    [phase, q]
  );

  const sections = [...PHASE_ORDER, "frameworks"].filter((p) => !phase || p === phase);

  return (
    <section>
      <div className="lib-bar">
        <input
          type="search"
          placeholder="Search methods, e.g. 'too many ideas'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search methods"
        />
        <div className="chips">
          <button className={"chip" + (!phase ? " on" : "")} onClick={() => setPhase(null)}>
            All
          </button>
          {[...PHASE_ORDER, "frameworks"].map((p) => (
            <button
              key={p}
              className={"chip" + (phase === p ? " on" : "")}
              style={{ "--c": PHASES[p].colour }}
              onClick={() => setPhase(phase === p ? null : p)}
            >
              {PHASES[p].label}
            </button>
          ))}
        </div>
      </div>

      {sections.map((p) => {
        const list = filtered.filter((m) => m.phases[0] === p || (phase && m.phases.includes(p)));
        if (!list.length) return null;
        const groups = [...new Set(list.map((m) => m.group))];
        return (
          <div key={p} className="phase-block">
            <h3 style={{ color: PHASES[p].colour }}>
              {PHASES[p].label} <span>{PHASES[p].ride}</span>
            </h3>
            <p className="muted">{PHASES[p].short}</p>
            {groups.map((g) => (
              <div key={g}>
                {groups.length > 1 && <h4>{g}</h4>}
                <div className="grid">
                  {list.filter((m) => m.group === g).map((m) => (
                    <Card key={m.id} m={m} onOpen={onOpen} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      })}
      {!filtered.length && <p className="muted">No methods match that. Try another word.</p>}
    </section>
  );
}

function Card({ m, onOpen }) {
  const c = PHASES[m.phases[0]].colour;
  return (
    <button className="card" style={{ "--c": c }} onClick={() => onOpen(m.id)}>
      <span className="card-top">
        <span className="dot" />
        <span className="time">{m.time}</span>
      </span>
      <strong>{m.name}</strong>
      <span className="sum">{m.summary}</span>
      <span className="more">How to do it →</span>
    </button>
  );
}

/* ---------------- Method detail ---------------- */

function MethodDetail({ id, onOpen, onClose }) {
  const m = byId[id];
  useEsc(onClose);
  if (!m) return null;
  return (
    <div className="overlay" onClick={onClose}>
      <article className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={m.name}>
        <button className="x" onClick={onClose} aria-label="Close">✕</button>
        <div className="tags">
          {m.phases.map((p) => (
            <span key={p} className="tag" style={{ "--c": PHASES[p].colour }}>
              {PHASES[p].label} · {PHASES[p].ride}
            </span>
          ))}
          <span className="tag plain">{m.time}</span>
        </div>
        <h2>{m.name}</h2>
        <p className="big">{m.summary}</p>

        <h4>Use it when</h4>
        <p>{m.when}</p>

        <h4>How to do it</h4>
        <ol className="steps">
          {m.steps.map((s, i) => <li key={i}>{s}</li>)}
        </ol>

        <h4>Why it helps</h4>
        <p>{m.why}</p>

        {(m.before.length > 0 || m.next.length > 0) && (
          <div className="links">
            {m.before.length > 0 && (
              <div>
                <h4>Usually comes after</h4>
                {m.before.map((b) => byId[b] && (
                  <button key={b} className="link" onClick={() => onOpen(b)}>← {byId[b].name}</button>
                ))}
              </div>
            )}
            {m.next.length > 0 && (
              <div>
                <h4>Leads well into</h4>
                {m.next.map((n) => byId[n] && (
                  <button key={n} className="link" onClick={() => onOpen(n)}>{byId[n].name} →</button>
                ))}
              </div>
            )}
          </div>
        )}
      </article>
    </div>
  );
}

/* ---------------- Double diamond explainer ---------------- */

function DoubleDiamond({ onClose }) {
  useEsc(onClose);
  return (
    <div className="overlay" onClick={onClose}>
      <article className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="The double diamond">
        <button className="x" onClick={onClose} aria-label="Close">✕</button>
        <p className="kicker">One-minute explainer</p>
        <h2>The double diamond</h2>
        <p className="big">
          Most BCII projects move through two diamonds. In each one you first <b>open up</b> (explore lots
          of options) and then <b>narrow down</b> (choose).
        </p>
        <svg viewBox="0 0 600 170" className="dd" aria-hidden="true">
          <polygon points="20,85 150,15 280,85 150,155" fill={PHASES.discover.colour} opacity=".15" />
          <polygon points="320,85 450,15 580,85 450,155" fill={PHASES.develop.colour} opacity=".15" />
          <path d="M20 85 L150 15 L150 155 Z" fill={PHASES.discover.colour} opacity=".35" />
          <path d="M150 15 L280 85 L150 155 Z" fill={PHASES.define.colour} opacity=".35" />
          <path d="M320 85 L450 15 L450 155 Z" fill={PHASES.develop.colour} opacity=".35" />
          <path d="M450 15 L580 85 L450 155 Z" fill={PHASES.deliver.colour} opacity=".35" />
          <text x="95" y="90" textAnchor="middle">Discover</text>
          <text x="205" y="90" textAnchor="middle">Define</text>
          <text x="395" y="90" textAnchor="middle">Develop</text>
          <text x="515" y="90" textAnchor="middle">Deliver</text>
          <text x="300" y="80" textAnchor="middle" className="small">challenge</text>
          <text x="300" y="95" textAnchor="middle" className="small">→</text>
        </svg>
        <ul className="dd-list">
          {PHASE_ORDER.map((p) => (
            <li key={p}>
              <b style={{ color: PHASES[p].colour }}>{PHASES[p].label} ({PHASES[p].ride})</b>{" "}
              {PHASES[p].short}
            </li>
          ))}
        </ul>
        <p>
          The ride isn't one way. It's normal to roll back from Develop to Define when an idea exposes a
          gap in your research. Being stuck usually means the team is in a different part of the ride than
          it thinks.
        </p>
        <button className="primary" onClick={onClose}>Got it, show me the ride</button>
      </article>
    </div>
  );
}

/* ---------------- Assistant ---------------- */

function Assistant({ onOpen, setMarker }) {
  const [picked, setPicked] = useState([]);
  const [stuck, setStuck] = useState("");
  const [tried, setTried] = useState("");
  const [deadline, setDeadline] = useState("this week");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const toggle = (s) => setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  async function go() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const r = await fetch("/api/match", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ stuck, symptoms: picked, tried, deadline }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Something went wrong.");
      setResult(j);
      setMarker(j.phase);
      setTimeout(() => document.getElementById("result")?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="assistant">
      <p className="tip">
        Works best when you're in the thick of a project. Just starting out? Browsing the Discover
        methods is usually the better first step.
      </p>

      <label className="q">What does being stuck look like for your team?</label>
      <p className="muted">You don't need to know the cause. Pick anything that sounds familiar.</p>
      <div className="chips wrap">
        {SYMPTOMS.map((s) => (
          <button key={s} className={"chip sym" + (picked.includes(s) ? " on" : "")} onClick={() => toggle(s)}>
            {s}
          </button>
        ))}
      </div>

      <label className="q" htmlFor="stuck">Anything else going on? <span>(optional)</span></label>
      <textarea
        id="stuck"
        rows={3}
        value={stuck}
        onChange={(e) => setStuck(e.target.value)}
        placeholder="e.g. Half the team wants to start building the app, the other half thinks we haven't talked to enough users."
      />

      <div className="row">
        <div>
          <label className="q" htmlFor="tried">Methods you've already tried <span>(optional)</span></label>
          <input id="tried" value={tried} onChange={(e) => setTried(e.target.value)} placeholder="e.g. Crazy 8's, empathy map" />
        </div>
        <div>
          <label className="q" htmlFor="dl">Deadline</label>
          <select id="dl" value={deadline} onChange={(e) => setDeadline(e.target.value)}>
            <option>later today</option>
            <option>this week</option>
            <option>a few weeks out</option>
            <option>no immediate deadline</option>
          </select>
        </div>
      </div>

      <button className="primary" onClick={go} disabled={loading || (!stuck.trim() && !picked.length)}>
        {loading ? "Working out where you are..." : "Find my route forward"}
      </button>
      {error && <p className="error">{error}</p>}

      {result && (
        <div id="result" className="result">
          {result.phase && (
            <p className="where" style={{ "--c": PHASES[result.phase].colour }}>
              Looks like you're in <b>{PHASES[result.phase].label}</b>, {PHASES[result.phase].ride}.
            </p>
          )}
          {result.stepBack && (
            <p className="stepback">
              It might be worth rolling back a stage before pushing forward. That's a normal part of the ride.
            </p>
          )}
          <p>{result.diagnosis}</p>
          <div className="picks">
            {result.picks.map((p, i) => {
              const m = byId[p.id];
              return (
                <div key={p.id} className="pick" style={{ "--c": PHASES[m.phases[0]].colour }}>
                  <span className="num">{i + 1}</span>
                  <h3>{m.name}</h3>
                  <p>{p.why}</p>
                  {p.firstStep && <p className="first"><b>In the next hour:</b> {p.firstStep}</p>}
                  <button className="link" onClick={() => onOpen(p.id)}>How to do it →</button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

function useEsc(fn) {
  useEffect(() => {
    const h = (e) => e.key === "Escape" && fn();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [fn]);
}
