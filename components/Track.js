"use client";
import { PHASES } from "../lib/methods";

// The rollercoaster: each phase of the Double Diamond is a section of track.
const SEGMENTS = {
  discover: "M 30 220 L 70 220 C 130 220 190 40 255 40",
  define: "M 255 40 C 300 40 330 228 420 228",
  develop:
    "M 420 228 C 480 228 540 190 610 190 C 700 190 700 70 640 70 C 580 70 580 190 670 190 C 710 190 735 198 760 200",
  deliver: "M 760 200 L 970 200",
};

const LABELS = {
  discover: { x: 140, y: 252 },
  define: { x: 345, y: 256 },
  develop: { x: 640, y: 244 },
  deliver: { x: 880, y: 236 },
};

const SHAPE = { discover: "diverge", define: "converge", develop: "diverge", deliver: "converge" };

// where the cart sits for each stage: x, y (on the rail), tilt
const CART_POS = {
  start: [52, 220, 0],
  discover: [161, 130, -55],
  define: [321, 134, 60],
  develop: [530, 203, -14],
  deliver: [880, 200, 0],
};

export default function Track({ active, onPick, marker }) {
  const where = marker || (active && active !== "frameworks" ? active : "start");
  const label = marker ? "You are here" : where === "start" ? "Hop on!" : null;
  return (
    <svg className="track" viewBox="0 0 1000 280" role="group"
      aria-label="The project rollercoaster. Pick a stage to filter methods.">
      {[110, 170, 230, 300, 360, 520, 820, 900].map((x) => (
        <line key={x} x1={x} x2={x} y1={yOn(x)} y2={272} className="strut" />
      ))}
      <line x1="10" x2="990" y1="272" y2="272" className="ground" />

      {Object.entries(SEGMENTS).map(([k, d]) => {
        const dim = active && active !== k && active !== "frameworks";
        return (
          <g key={k} opacity={dim ? 0.25 : 1} className="seg">
            <path d={d} className="rail-shadow" />
            <path d={d} className="rail" stroke={PHASES[k].colour} />
            <path d={d} className="rail-ties" />
          </g>
        );
      })}

      <TrackCart pos={CART_POS[where]} label={label} />

      {Object.entries(LABELS).map(([k, l]) => (
        <g key={k} className={"station" + (active === k ? " on" : "")}
          onClick={() => onPick(active === k ? null : k)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onPick(active === k ? null : k)}
          tabIndex={0} role="button" aria-pressed={active === k}>
          <rect x={l.x - 72} y={l.y - 26} width="144" height="46" rx="12" className="hit" />
          <text x={l.x} y={l.y - 5} textAnchor="middle" className="st-name" fill={PHASES[k].colour}>
            {PHASES[k].label}
          </text>
          <text x={l.x} y={l.y + 12} textAnchor="middle" className="st-ride">
            {PHASES[k].ride} · {SHAPE[k]}
          </text>
        </g>
      ))}
    </svg>
  );
}

function TrackCart({ pos, label }) {
  const [x, y, r] = pos;
  return (
    <g className="track-cart" style={{ transform: `translate(${x}px, ${y}px)` }}>
      <g style={{ transform: `rotate(${r}deg)` }} className="track-cart-body">
        <g transform="translate(-26 -40)">
          <path d="M6 10h40l-4 18H10z" className="cart-fill" />
          <path d="M6 10h40" className="cart-line" />
          <rect x="13" y="14" width="8" height="7" rx="2" fill="#fff" opacity=".85" />
          <rect x="24" y="14" width="8" height="7" rx="2" fill="#fff" opacity=".85" />
          <rect x="35" y="14" width="5" height="7" rx="2" fill="#fff" opacity=".85" />
          <circle cx="16" cy="32" r="5" className="cart-wheel" />
          <circle cx="36" cy="32" r="5" className="cart-wheel" />
          <circle cx="18" cy="4" r="3" className="cart-fill" />
          <circle cx="34" cy="4" r="3" className="cart-fill" />
          <path d="M18 10V6 M34 10V6" className="cart-line thin" />
        </g>
      </g>
      {label && (
        <g transform="translate(0 -58)">
          <rect x="-50" y="-16" width="100" height="24" rx="12" className="cart-tag" />
          <text x="0" y="0" textAnchor="middle" className="car-label">{label}</text>
        </g>
      )}
    </g>
  );
}

function yOn(x) {
  if (x < 70) return 220;
  if (x < 255) return 220 - ((x - 70) / 185) * 180;
  if (x < 420) return 40 + ((x - 255) / 165) * 188;
  return 200;
}
