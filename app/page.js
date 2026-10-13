"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Track from "../components/Track";
import Icon, { Cart } from "../components/Icon";
import Template, { hasTemplate } from "../components/Templates";
import { METHODS, PHASES, PHASE_ORDER, SYMPTOM_GROUPS, TIME_OPTIONS } from "../lib/methods";

/* ---------- small storage helpers (per browser, never required) ---------- */
function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export default function Home() {
  const [tab, setTab] = useState("library");
  const [phase, setPhase] = useState(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(null);
  const [ddOpen, setDdOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [marker, setMarker] = useState(null);
  const [view, setView] = useState("detailed");
  const [mine, setMine] = useState([]);
  const tabsRef = useRef(null);

  useEffect(() => {
    setView(load("view", "detailed"));
    setMine(load("my-methods", []));
    if (!load("seen-dd", false)) {
      setDdOpen(true);
      save("seen-dd", true);
    }
  }, []);

  const all = useMemo(() => [...METHODS, ...mine], [mine]);
  const byId = useMemo(() => Object.fromEntries(all.map((m) => [m.id, m])), [all]);

  const changeView = (v) => {
    setView(v);
    save("view", v);
  };
  const addMethod = (m) => {
    const next = [...mine, m];
    setMine(next);
    save("my-methods", next);
  };
  const removeMethod = (id) => {
    const next = mine.filter((m) => m.id !== id);
    setMine(next);
    save("my-methods", next);
    setOpen(null);
  };
  const goAssistant = () => {
    setTab("assistant");
    setTimeout(() => tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
  };

  return (
    <main>
      <header className="top">
        <div>
          <p className="brand">
            <Cart size={34} colour="var(--ink)" />
            <span>BCII method library &amp; project assistant</span>
          </p>
          <h1>The BCII Rollercoaster</h1>
          <p className="lede">
            Every project has climbs, drops and loops. Find where your team is on the ride, then pick a
            method to get moving again.
          </p>
        </div>
        <button className="ghost" onClick={() => setDdOpen(true)}>
          <Icon name="diamond" size={18} /> New to the Double Diamond?
        </button>
      </header>

      <section className="ride">
        <div className="ride-head">
          <h2>Where are you on the ride?</h2>
          <p className="muted">Tap a stage to see its methods.</p>
        </div>
        <Track active={phase} onPick={(p) => { setPhase(p); setTab("library"); }} marker={marker} />
        {phase && phase !== "frameworks" && (
          <div className="phase-note" style={{ "--c": PHASES[phase].colour }}>
            <PhaseShape phase={phase} />
            <p>
              <strong>{PHASES[phase].label}, {PHASES[phase].ride}.</strong> {PHASES[phase].short}
            </p>
          </div>
        )}
      </section>

      <StuckCta onClick={goAssistant} />

      <nav className="tabs" role="tablist" ref={tabsRef}>
        <button role="tab" aria-selected={tab === "library"} onClick={() => setTab("library")}>
          <Icon name="cards" size={18} /> Method library
        </button>
        <button role="tab" className="tab-stuck" aria-selected={tab === "assistant"} onClick={() => setTab("assistant")}>
          <Icon name="sparkle" size={18} /> Ask the assistant
        </button>
      </nav>

      {tab === "library" ? (
        <Library all={all} phase={phase} setPhase={setPhase} query={query} setQuery={setQuery}
          onOpen={setOpen} view={view} setView={changeView} onAdd={() => setAddOpen(true)} />
      ) : (
        <Assistant byId={byId} onOpen={setOpen} setMarker={setMarker} />
      )}

      <footer>
        <Cart size={26} colour="var(--muted)" />
        <span>
          Built by BCII students for BCII students. Method guidance is a starting point: adapt it to your
          project and check with your tutor.
        </span>
      </footer>

      {open && byId[open] && (
        <MethodDetail m={byId[open]} byId={byId} onOpen={setOpen} onClose={() => setOpen(null)} onRemove={removeMethod} />
      )}
      {ddOpen && <DoubleDiamond onClose={() => setDdOpen(false)} />}
      {addOpen && <AddMethod all={all} onSave={(m) => { addMethod(m); setAddOpen(false); setOpen(m.id); }} onClose={() => setAddOpen(false)} />}
    </main>
  );
}

/* ---------------- Stuck call to action ---------------- */

function StuckCta({ onClick }) {
  return (
    <section className="stuck-cta">
      <div className="scribble" aria-hidden="true">
        <span className="hand">Stuck?</span>
        <svg viewBox="0 0 170 90" className="hand-arrow">
          <path d="M8 18 C 40 4, 78 6, 100 30 C 118 50, 128 62, 158 70" />
          <path d="M140 56 L 160 71 L 137 80" />
        </svg>
      </div>
      <div className="cta-copy">
        <h2>Not sure what to do next?</h2>
        <p>Pick what being stuck looks like. The assistant works out where you are and plots a three-step route.</p>
      </div>
      <button className="cta-btn" onClick={onClick}>
        <Icon name="sparkle" size={20} /> Ask the assistant
      </button>
    </section>
  );
}

/* ---------------- Library ---------------- */

function Library({ all, phase, setPhase, query, setQuery, onOpen, view, setView, onAdd }) {
  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      all.filter(
        (m) =>
          (!phase || m.phases.includes(phase)) &&
          (!q || (m.name + " " + m.summary + " " + m.when).toLowerCase().includes(q))
      ),
    [all, phase, q]
  );
  const sections = [...PHASE_ORDER, "frameworks"].filter((p) => !phase || p === phase);

  return (
    <section>
      <div className="lib-bar">
        <div className="lib-row">
          <label className="search">
            <Icon name="search" size={18} />
            <input type="search" placeholder="Search, e.g. 'too many ideas'" value={query}
              onChange={(e) => setQuery(e.target.value)} aria-label="Search methods" />
          </label>
          <div className="seg-toggle" role="group" aria-label="Card size">
            <button aria-pressed={view === "detailed"} onClick={() => setView("detailed")} title="Large cards">
              <Icon name="cards" size={18} /> <span>Detailed</span>
            </button>
            <button aria-pressed={view === "compact"} onClick={() => setView("compact")} title="Small tiles">
              <Icon name="tiles" size={18} /> <span>Compact</span>
            </button>
          </div>
          <button className="add-btn" onClick={onAdd}>
            <Icon name="plus" size={18} /> Add a method
          </button>
        </div>
        <div className="chips">
          <button className={"chip" + (!phase ? " on" : "")} onClick={() => setPhase(null)}>All</button>
          {[...PHASE_ORDER, "frameworks"].map((p) => (
            <button key={p} className={"chip" + (phase === p ? " on" : "")} style={{ "--c": PHASES[p].colour }}
              onClick={() => setPhase(phase === p ? null : p)}>
              <span className="chip-dot" /> {PHASES[p].label}
            </button>
          ))}
        </div>
      </div>

      {sections.map((p) => {
        const list = filtered.filter((m) => m.phases[0] === p || (phase && m.phases.includes(p)));
        if (!list.length) return null;
        const groups = [...new Set(list.map((m) => m.group))];
        return (
          <div key={p} className="phase-block" style={{ "--c": PHASES[p].colour }}>
            <div className="phase-head">
              <PhaseShape phase={p} big />
              <div>
                <h3>{PHASES[p].label} <span>{PHASES[p].ride}</span></h3>
                <p className="muted">{PHASES[p].short}</p>
              </div>
            </div>
            {groups.map((g) => (
              <div key={g}>
                {groups.length > 1 && <h4>{g}</h4>}
                <div className={view === "compact" ? "grid compact" : "grid"}>
                  {list.filter((m) => m.group === g).map((m) =>
                    view === "compact" ? <Tile key={m.id} m={m} onOpen={onOpen} /> : <Card key={m.id} m={m} onOpen={onOpen} />
                  )}
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
  return (
    <button className="card" style={{ "--c": PHASES[m.phases[0]].colour }} onClick={() => onOpen(m.id)}>
      <span className="card-top">
        <span className="ico-circle"><Icon name={m.icon} /></span>
        <span className="badges">
          {m.custom && <span className="badge mine">Yours</span>}
          {hasTemplate(m.id) && <span className="badge"><Icon name="grid" size={13} /> Template</span>}
          <span className="badge plain"><Icon name="clock" size={13} /> {m.time}</span>
        </span>
      </span>
      <strong>{m.name}</strong>
      <span className="sum">{m.summary}</span>
      <span className="more">How to do it →</span>
    </button>
  );
}

function Tile({ m, onOpen }) {
  return (
    <button className="tile" style={{ "--c": PHASES[m.phases[0]].colour }} onClick={() => onOpen(m.id)} title={m.summary}>
      <span className="ico-circle sm"><Icon name={m.icon} size={18} /></span>
      <span className="tile-name">{m.name}</span>
      {hasTemplate(m.id) && <Icon name="grid" size={14} className="tile-tpl" title="Has a template" />}
      {m.custom && <span className="badge mine">Yours</span>}
    </button>
  );
}

// A half-diamond showing whether a stage opens up (diverge) or narrows down (converge).
function PhaseShape({ phase, big }) {
  const c = PHASES[phase].colour;
  const s = big ? 44 : 30;
  const diverge = phase === "discover" || phase === "develop";
  if (phase === "frameworks") {
    return (
      <svg width={s} height={s} viewBox="0 0 40 40" aria-hidden="true">
        <path d="M2 20 L11 11 L20 20 L11 29Z M20 20 L29 11 L38 20 L29 29Z" fill={c} opacity=".85" />
      </svg>
    );
  }
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" aria-hidden="true">
      <path d="M2 20 L20 2 L38 20 L20 38Z" fill="none" stroke={c} strokeWidth="2" opacity=".35" />
      <path d={diverge ? "M2 20 L20 2 L20 38Z" : "M20 2 L38 20 L20 38Z"} fill={c} />
    </svg>
  );
}

/* ---------------- Method detail ---------------- */

function MethodDetail({ m, byId, onOpen, onClose, onRemove }) {
  useEsc(onClose);
  const c = PHASES[m.phases[0]].colour;
  const before = (m.before || []).filter((id) => byId[id]);
  const next = (m.next || []).filter((id) => byId[id]);
  return (
    <div className="overlay" onClick={onClose}>
      <article className="sheet" style={{ "--c": c }} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={m.name}>
        <button className="x" onClick={onClose} aria-label="Close"><Icon name="x" size={18} /></button>
        <div className="detail-head">
          <span className="ico-circle lg"><Icon name={m.icon} size={30} /></span>
          <div>
            <div className="tags">
              {m.phases.map((p) => (
                <span key={p} className="tag" style={{ "--c": PHASES[p].colour }}>
                  {PHASES[p].label} · {PHASES[p].ride}
                </span>
              ))}
              <span className="tag plain"><Icon name="clock" size={13} /> {m.time}</span>
              {m.custom && <span className="tag mine">Added by you</span>}
            </div>
            <h2>{m.name}</h2>
          </div>
        </div>
        <p className="big">{m.summary}</p>

        <div className="when">
          <Icon name="target" size={22} />
          <div><b>Use it when</b><p>{m.when}</p></div>
        </div>

        <h4>How to do it</h4>
        <ol className="steps">
          {m.steps.map((s, i) => <li key={i}>{s}</li>)}
        </ol>

        {hasTemplate(m.id) && (
          <>
            <h4>Template</h4>
            <Template id={m.id} />
          </>
        )}

        {m.why && (
          <div className="when why">
            <Icon name="bulb" size={22} />
            <div><b>Why it helps</b><p>{m.why}</p></div>
          </div>
        )}

        {(before.length > 0 || next.length > 0) && (
          <>
            <h4>Where it sits on the ride</h4>
            <div className="flow">
              <div className="flow-col">
                {before.length ? before.map((b) => (
                  <button key={b} className="flow-chip" style={{ "--c": PHASES[byId[b].phases[0]].colour }} onClick={() => onOpen(b)}>
                    <Icon name={byId[b].icon} size={16} /> {byId[b].name}
                  </button>
                )) : <span className="flow-empty">Start here</span>}
              </div>
              <Icon name="route" size={22} className="flow-arrow" />
              <div className="flow-col"><span className="flow-chip this"><Icon name={m.icon} size={16} /> {m.name}</span></div>
              <Icon name="route" size={22} className="flow-arrow" />
              <div className="flow-col">
                {next.length ? next.map((n) => (
                  <button key={n} className="flow-chip" style={{ "--c": PHASES[byId[n].phases[0]].colour }} onClick={() => onOpen(n)}>
                    <Icon name={byId[n].icon} size={16} /> {byId[n].name}
                  </button>
                )) : <span className="flow-empty">Finish line 🏁</span>}
              </div>
            </div>
          </>
        )}

        {m.custom && (
          <button className="danger" onClick={() => onRemove(m.id)}>
            <Icon name="trash" size={16} /> Remove this method
          </button>
        )}
      </article>
    </div>
  );
}

/* ---------------- Double Diamond explainer ---------------- */

function DoubleDiamond({ onClose }) {
  useEsc(onClose);
  return (
    <div className="overlay" onClick={onClose}>
      <article className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="The Double Diamond">
        <button className="x" onClick={onClose} aria-label="Close"><Icon name="x" size={18} /></button>
        <p className="kicker">One-minute explainer</p>
        <h2>The Double Diamond</h2>
        <p className="big">
          Most BCII projects move through two diamonds. In each one you first <b>open up</b> (explore lots
          of options) and then <b>narrow down</b> (choose).
        </p>
        <Template id="double-diamond" />
        <div className="dd-grid">
          {PHASE_ORDER.map((p) => (
            <div key={p} className="dd-cell" style={{ "--c": PHASES[p].colour }}>
              <PhaseShape phase={p} />
              <b>{PHASES[p].label}</b>
              <span className="dd-ride">{PHASES[p].ride}</span>
              <span>{PHASES[p].short}</span>
            </div>
          ))}
        </div>
        <p className="loopback">
          <Icon name="back" size={20} /> The ride isn't one way. Rolling back from Develop to Define is normal. Being stuck usually means the team is in a different part of the ride than it thinks.
        </p>
        <button className="primary" onClick={onClose}><Cart size={26} colour="currentColor" /> Got it, show me the ride</button>
      </article>
    </div>
  );
}

/* ---------------- Add a method ---------------- */

const ICON_CHOICES = ["bulb", "users", "search", "target", "grid", "route", "pencil", "flask", "chat", "compass", "layers", "sparkle"];

function AddMethod({ all, onSave, onClose }) {
  useEsc(onClose);
  const [name, setName] = useState("");
  const [phases, setPhases] = useState(["discover"]);
  const [time, setTime] = useState("30 min");
  const [when, setWhen] = useState("");
  const [steps, setSteps] = useState(["", ""]);
  const [why, setWhy] = useState("");
  const [icon, setIcon] = useState("bulb");
  const [err, setErr] = useState("");

  const togglePhase = (p) =>
    setPhases((cur) => (cur.includes(p) ? (cur.length > 1 ? cur.filter((x) => x !== p) : cur) : [...cur, p]));

  function submit(e) {
    e.preventDefault();
    const clean = steps.map((s) => s.trim()).filter(Boolean);
    if (!name.trim()) return setErr("Give your method a name.");
    if (!clean.length) return setErr("Add at least one step.");
    if (all.some((m) => m.name.toLowerCase() === name.trim().toLowerCase())) return setErr("That method is already in the library.");
    const ordered = PHASE_ORDER.concat("frameworks").filter((p) => phases.includes(p));
    onSave({
      id: "my-" + Date.now(),
      custom: true,
      name: name.trim(),
      icon,
      phases: ordered,
      group: "Your methods",
      summary: when.trim() || "A method added by you.",
      when: when.trim() || "Whenever it fits your project.",
      steps: clean,
      why: why.trim(),
      time,
      before: [],
      next: [],
    });
  }

  return (
    <div className="overlay" onClick={onClose}>
      <form className="sheet add" onClick={(e) => e.stopPropagation()} onSubmit={submit} role="dialog" aria-modal="true" aria-label="Add a method">
        <button type="button" className="x" onClick={onClose} aria-label="Close"><Icon name="x" size={18} /></button>
        <p className="kicker">Add to your library</p>
        <h2>Add a method you know</h2>
        <p className="muted">Saved in this browser only, so it's yours. Great for methods from other subjects or your workplace.</p>

        <label className="q" htmlFor="m-name">Method name</label>
        <input id="m-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Lotus Blossom" maxLength={60} />

        <label className="q">Which part of the Double Diamond?</label>
        <div className="phase-pick">
          {[...PHASE_ORDER, "frameworks"].map((p) => (
            <button type="button" key={p} aria-pressed={phases.includes(p)} style={{ "--c": PHASES[p].colour }} onClick={() => togglePhase(p)}>
              <PhaseShape phase={p} />
              <b>{PHASES[p].label}</b>
              <span>{PHASES[p].ride}</span>
            </button>
          ))}
        </div>

        <label className="q">How long does it take?</label>
        <div className="chips">
          {TIME_OPTIONS.map((t) => (
            <button type="button" key={t} className={"chip" + (time === t ? " on" : "")} onClick={() => setTime(t)}>
              <Icon name="clock" size={14} /> {t}
            </button>
          ))}
        </div>

        <label className="q">Pick an icon</label>
        <div className="icon-pick">
          {ICON_CHOICES.map((i) => (
            <button type="button" key={i} aria-pressed={icon === i} onClick={() => setIcon(i)} aria-label={i}>
              <Icon name={i} />
            </button>
          ))}
        </div>

        <label className="q" htmlFor="m-when">Use it when… <span>(optional)</span></label>
        <input id="m-when" value={when} onChange={(e) => setWhen(e.target.value)} placeholder="e.g. the team needs to expand one idea into many" maxLength={160} />

        <label className="q">Steps</label>
        <ol className="step-inputs">
          {steps.map((s, i) => (
            <li key={i}>
              <input value={s} onChange={(e) => setSteps(steps.map((x, j) => (j === i ? e.target.value : x)))} placeholder={`Step ${i + 1}`} maxLength={160} />
              {steps.length > 1 && (
                <button type="button" className="mini" onClick={() => setSteps(steps.filter((_, j) => j !== i))} aria-label="Remove step"><Icon name="x" size={14} /></button>
              )}
            </li>
          ))}
        </ol>
        {steps.length < 8 && (
          <button type="button" className="mini" onClick={() => setSteps([...steps, ""])}><Icon name="plus" size={14} /> Add a step</button>
        )}

        <label className="q" htmlFor="m-why">Why it helps <span>(optional)</span></label>
        <input id="m-why" value={why} onChange={(e) => setWhy(e.target.value)} maxLength={200} />

        {err && <p className="error">{err}</p>}
        <button className="primary" type="submit"><Icon name="plus" size={18} /> Add to my library</button>
      </form>
    </div>
  );
}

/* ---------------- Assistant ---------------- */

const DEADLINES = [
  { v: "later today", label: "Today", icon: "bolt" },
  { v: "this week", label: "This week", icon: "clock" },
  { v: "a few weeks out", label: "Few weeks", icon: "timeline" },
  { v: "no immediate deadline", label: "No rush", icon: "leaf" },
];

function Assistant({ byId, onOpen, setMarker }) {
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
      <p className="tip"><Icon name="clock" size={18} /> Best in the thick of a project. Just starting? Browse Discover first.</p>

      <h3 className="a-h"><span className="num-dot">1</span> What does stuck look like?</h3>
      <p className="muted">Tap anything that sounds familiar. You don't need to know the cause.</p>
      <MindMap picked={picked} toggle={toggle} />

      <h3 className="a-h"><span className="num-dot">2</span> Tell us more <span className="opt">optional</span></h3>
      <textarea rows={2} value={stuck} onChange={(e) => setStuck(e.target.value)} aria-label="Anything else going on"
        placeholder="e.g. Half the team wants to build the app, half thinks we need more interviews." />
      <input value={tried} onChange={(e) => setTried(e.target.value)} aria-label="Methods already tried"
        placeholder="Methods you've already tried, e.g. Crazy 8's" className="tried" />

      <h3 className="a-h"><span className="num-dot">3</span> When's it due?</h3>
      <div className="deadlines">
        {DEADLINES.map((d) => (
          <button key={d.v} aria-pressed={deadline === d.v} onClick={() => setDeadline(d.v)}>
            <Icon name={d.icon} size={20} /> {d.label}
          </button>
        ))}
      </div>

      <button className="cta-btn go" onClick={go} disabled={loading || (!stuck.trim() && !picked.length)}>
        {loading ? <><Cart size={26} colour="currentColor" className="bounce" /> Finding where you are…</> : <><Icon name="route" size={20} /> Plot my route</>}
      </button>
      {error && <p className="error">{error}</p>}

      {result && <Result result={result} byId={byId} onOpen={onOpen} />}
    </section>
  );
}

function MindMap({ picked, toggle }) {
  return (
    <div className="mindmap">
      <svg className="mm-lines" viewBox="0 0 300 300" preserveAspectRatio="none" aria-hidden="true">
        {[[50, 50], [250, 50], [50, 150], [250, 150], [150, 250]].map(([x, y], i) => (
          <path key={i} d={`M150 150 Q ${(150 + x) / 2 + (i % 2 ? 12 : -12)} ${(150 + y) / 2} ${x} ${y}`} />
        ))}
      </svg>
      <div className="mm-center">
        <Cart size={44} colour="var(--ink)" />
        <b>We're stuck</b>
        <span>{picked.length ? `${picked.length} picked` : "tap below"}</span>
      </div>
      {SYMPTOM_GROUPS.map((g) => (
        <div key={g.id} className={"mm-node mm-" + g.id} style={{ "--c": g.colour }}>
          <span className="mm-title"><Icon name={g.icon} size={18} /> {g.label}</span>
          {g.items.map((it) => (
            <button key={it.full} className={"mm-pill" + (picked.includes(it.full) ? " on" : "")}
              aria-pressed={picked.includes(it.full)} onClick={() => toggle(it.full)} title={it.full}>
              {picked.includes(it.full) ? "✓ " : ""}{it.label}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

function Result({ result, byId, onOpen }) {
  const ph = result.phase;
  const idx = PHASE_ORDER.indexOf(ph);
  const back = result.stepBack && idx > 0 ? PHASE_ORDER[idx - 1] : null;
  return (
    <div id="result" className="result">
      <div className="where-strip">
        {PHASE_ORDER.map((p) => (
          <div key={p} className={"ws-cell" + (p === ph ? " on" : "")} style={{ "--c": PHASES[p].colour }}>
            {p === ph && <Cart size={38} colour={PHASES[p].colour} className="ws-cart" />}
            <PhaseShape phase={p} />
            <b>{PHASES[p].label}</b>
            <span>{PHASES[p].ride}</span>
          </div>
        ))}
      </div>

      <div className="bubble-row">
        <span className="bubble-cart"><Cart size={40} colour={ph ? PHASES[ph].colour : "var(--ink)"} /></span>
        <p className="bubble">{result.diagnosis}</p>
      </div>
      {back && (
        <p className="stepback" style={{ "--c": PHASES[back].colour }}>
          <Icon name="back" size={20} /> Worth rolling back to <b>{PHASES[back].label}</b> first. That's normal.
        </p>
      )}

      <h3 className="route-h"><Icon name="route" size={20} /> Your route forward</h3>
      <div className="route">
        {result.picks.map((p, i) => {
          const m = byId[p.id];
          if (!m) return null;
          return (
            <div key={p.id} className="route-stop">
              <div className="pick" style={{ "--c": PHASES[m.phases[0]].colour }}>
                <div className="pick-top">
                  <span className="num">{i + 1}</span>
                  <span className="ico-circle"><Icon name={m.icon} /></span>
                  <span className="badge plain"><Icon name="clock" size={13} /> {m.time}</span>
                </div>
                <h3>{m.name}</h3>
                <p className="pick-line"><Icon name="target" size={16} /> {p.why}</p>
                {p.firstStep && <p className="pick-line first"><Icon name="bolt" size={16} /> {p.firstStep}</p>}
                <details>
                  <summary>How to do it ({m.steps.length} steps)</summary>
                  <ol className="steps mini-steps">{m.steps.map((s, k) => <li key={k}>{s}</li>)}</ol>
                </details>
                <button className="link" onClick={() => onOpen(m.id)}>
                  {hasTemplate(m.id) ? "Open with template →" : "Open method →"}
                </button>
              </div>
              {i < result.picks.length - 1 && <span className="route-arrow" aria-hidden="true">→</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function useEsc(fn) {
  const ref = useRef(fn);
  ref.current = fn;
  const handler = useCallback((e) => e.key === "Escape" && ref.current(), []);
  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handler]);
}
