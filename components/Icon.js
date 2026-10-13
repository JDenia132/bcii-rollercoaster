// Simple line icons (24x24, stroke based) so the tool can show pictures instead of text.
const P = {
  map: "M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z M9 3v15 M15 6v15",
  compass: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M15.5 8.5l-2 5-5 2 2-5z",
  layers: "M12 3l9 5-9 5-9-5z M3 13l9 5 9-5 M3 17.5l9 5 9-5",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M20 20l-4-4",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6 M16 4.5a3.5 3.5 0 0 1 0 6.5 M18 14c2.2.6 3.5 2.8 3.5 6",
  user: "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21c0-4 3.6-7 8-7s8 3 8 7",
  route: "M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M8 17h6a3 3 0 0 0 0-6H10a3 3 0 0 1 0-6h6",
  bulb: "M9 18h6 M10 21h4 M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z",
  target: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z M12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z",
  grid: "M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z",
  scale: "M12 3v18 M5 21h14 M4 8h16 M4 8l-2.5 6a3 3 0 0 0 5 0z M20 8l-2.5 6a3 3 0 0 0 5 0z",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7v5l3 2",
  flask: "M9 3h6 M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3 M7 15h10",
  pause: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M10 9v6 M14 9v6",
  shuffle: "M3 7h4l10 10h4 M3 17h4l3-3 M14 10l3-3h4 M18 4l3 3-3 3 M18 14l3 3-3 3",
  book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z M4 21V5 M8 7h7",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z",
  leaf: "M5 19C5 10 11 4 20 4c0 9-6 15-15 15z M5 19l8-8",
  hand: "M8 13V5.5a1.5 1.5 0 0 1 3 0V12 M11 11V4.5a1.5 1.5 0 0 1 3 0V12 M14 11.5V6a1.5 1.5 0 0 1 3 0v7c0 4.5-2.5 8-7 8-3 0-4.5-1.5-6-4l-1.5-3a1.5 1.5 0 0 1 2.6-1.5L8 15",
  trophy: "M8 4h8v5a4 4 0 0 1-8 0z M8 6H5a3 3 0 0 0 3 4 M16 6h3a3 3 0 0 1-3 4 M12 13v4 M8 21h8 M9 17h6v4H9z",
  flag: "M5 21V4 M5 4h12l-2 4 2 4H5",
  chat: "M4 5h16v11H9l-5 4z",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  loop: "M4 12a8 8 0 0 1 14-5.3 M20 12a8 8 0 0 1-14 5.3 M18 3v4h-4 M6 21v-4h4",
  back: "M9 14l-5-5 5-5 M4 9h10a6 6 0 0 1 0 12h-3",
  bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
  plus: "M12 5v14 M5 12h14",
  download: "M12 3v12 M7 10l5 5 5-5 M4 20h16",
  list: "M8 6h12 M8 12h12 M8 18h12 M4 6h.01 M4 12h.01 M4 18h.01",
  tiles: "M4 4h4v4H4z M10 4h4v4h-4z M16 4h4v4h-4z M4 10h4v4H4z M10 10h4v4h-4z M16 10h4v4h-4z M4 16h4v4H4z M10 16h4v4h-4z M16 16h4v4h-4z",
  cards: "M3 4h8v7H3z M13 4h8v7h-8z M3 13h8v7H3z M13 13h8v7h-8z",
  x: "M6 6l12 12 M18 6L6 18",
  pencil: "M4 20l4-1 11-11-3-3L5 16z M14 6l3 3",
  diamond: "M12 2l10 10-10 10L2 12z",
  steps: "M3 20h5v-5h5v-5h5V5h3",
  question: "M9 9a3 3 0 1 1 4.5 2.6c-.9.5-1.5 1.2-1.5 2.4 M12 18h.01 M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z",
  trash: "M4 7h16 M9 7V4h6v3 M6 7l1 13h10l1-13",
  print: "M7 9V3h10v6 M6 17H4v-7h16v7h-2 M7 14h10v7H7z",
  basin: "M2 8c3 0 4 9 10 9s7-9 10-9 M12 13a2 2 0 1 0 0 .1",
  timeline: "M3 12h18 M6 9v6 M12 9v6 M18 9v6 M18 5l3 0",
  tree: "M12 3v6 M12 9l-6 5 M12 9l6 5 M6 14v4 M18 14v4 M12 9v9 M4 18h4 M10 18h4 M16 18h4",
  mask: "M3 5c3 1.5 6 1.5 9 0 3 1.5 6 1.5 9 0v6c0 5-4.5 9-9 9s-9-4-9-9z M8 11h2 M14 11h2 M9 15c2 1.5 4 1.5 6 0",
  theatre: "M4 4h16v4c0 4-3.5 7-8 7s-8-3-8-7z M8 21h8 M12 15v6",
};

export default function Icon({ name, size = 22, stroke = 1.8, className = "", title }) {
  const d = P[name] || P.diamond;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={"icon " + className}
      aria-hidden={title ? undefined : "true"}
      role={title ? "img" : undefined}
    >
      {title && <title>{title}</title>}
      <path d={d} />
    </svg>
  );
}

// The rollercoaster cart, used as the tool's mascot and "you are here" marker.
export function Cart({ size = 40, colour = "currentColor", className = "" }) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 64 48" className={"cart " + className} aria-hidden="true">
      <path d="M8 12h48l-5 22H13z" fill={colour} />
      <path d="M8 12h48" stroke={colour} strokeWidth="4" strokeLinecap="round" />
      <rect x="16" y="18" width="10" height="8" rx="2" fill="#fff" opacity=".85" />
      <rect x="29" y="18" width="10" height="8" rx="2" fill="#fff" opacity=".85" />
      <rect x="42" y="18" width="7" height="8" rx="2" fill="#fff" opacity=".85" />
      <circle cx="20" cy="38" r="6" fill="#fff" stroke={colour} strokeWidth="4" />
      <circle cx="44" cy="38" r="6" fill="#fff" stroke={colour} strokeWidth="4" />
      <path d="M22 12V6 M42 12V6" stroke={colour} strokeWidth="3" strokeLinecap="round" />
      <circle cx="22" cy="5" r="3" fill={colour} />
      <circle cx="42" cy="5" r="3" fill={colour} />
    </svg>
  );
}
