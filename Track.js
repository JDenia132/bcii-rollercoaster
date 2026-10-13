"use client";
import { PHASES } from "../lib/methods";

// The rollercoaster: each phase of the double diamond is a section of track.
const SEGMENTS = {
  discover: "M 30 220 L 70 220 C 130 220 190 40 255 40",
  define: "M 255 40 C 300 40 330 228 420 228",
  develop:
    "M 420 228 C 480 228 540 190 610 190 C 700 190 700 70 640 70 C 580 70 580 190 670 190 C 710 190 735 198 760 200",
  deliver: "M 760 200 L 970 200",
};

const LABELS = {
  discover: { x: 140, y: 245, anchor: "middle" },
  define: { x: 340, y: 252, anchor: "middle" },
  develop: { x: 640, y: 240, anchor: "middle" },
  deliver: { x: 865, y: 230, anchor: "middle" },
};

const SHAPE = {
  discover: "diverge",
  define: "converge",
  develop: "diverge",
  deliver: "converge",
};

export default function Track({ active, onPick, marker }) {
  return (
    <svg
      className="track"
      viewBox="0 0 1000 270"
      role="group"
      aria-label="The project rollercoaster. Pick a stage to filter methods."
    >
      {/* supports */}
      {[110, 170, 230, 300, 360, 520, 820, 900].map((x) => (
        <line key={x} x1={x} x2={x} y1={yOn(x)} y2={262} className="strut" />
      ))}
      <line x1="10" x2="990" y1="262" y2="262" className="ground" />

      {Object.entries(SEGMENTS).map(([k, d]) => {
        const dim = active && active !== k && active !== "frameworks";
        return (
          <g key={k} opacity={dim ? 0.25 : 1}>
            <path d={d} className="rail-shadow" />
            <path d={d} className="rail" stroke={PHASES[k].colour} />
          </g>
        );
      })}

      {marker && <Car phase={marker} />}

      {Object.entries(LABELS).map(([k, l]) => (
        <g
          key={k}
          className={"station" + (active === k ? " on" : "")}
          onClick={() => onPick(active === k ? null : k)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onPick(active === k ? null : k)}
          tabIndex={0}
          role="button"
          aria-pressed={active === k}
        >
          <rect x={l.x - 70} y={l.y - 26} width="140" height="44" rx="10" className="hit" />
          <text x={l.x} y={l.y - 6} textAnchor={l.anchor} className="st-name" fill={PHASES[k].colour}>
            {PHASES[k].label}
          </text>
          <text x={l.x} y={l.y + 10} textAnchor={l.anchor} className="st-ride">
            {PHASES[k].ride} · {SHAPE[k]}
          </text>
        </g>
      ))}
    </svg>
  );
}

function yOn(x) {
  // rough height of the track at x, for the support struts
  if (x < 70) return 220;
  if (x < 255) return 220 - ((x - 70) / 185) * 180;
  if (x < 420) return 40 + ((x - 255) / 165) * 188;
  if (x < 760) return 200;
  return 200;
}

const CAR_POS = {
  discover: [190, 92, -38],
  define: [330, 150, 55],
  develop: [560, 205, -10],
  deliver: [880, 200, 0],
};

function Car({ phase }) {
  const [x, y, r] = CAR_POS[phase] || CAR_POS.discover;
  return (
    <g transform={`translate(${x} ${y})`} className="car">
      <g transform={`rotate(${r})`}>
        <rect x="-22" y="-20" width="44" height="18" rx="5" />
        <circle cx="-12" cy="0" r="4" />
        <circle cx="12" cy="0" r="4" />
      </g>
      <text x="0" y="-34" textAnchor="middle" className="car-label">
        You are here
      </text>
    </g>
  );
}
