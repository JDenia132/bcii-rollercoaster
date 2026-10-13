"use client";
// Blank, printable templates for methods. Colours are hard-coded (not CSS variables)
// so the downloaded PNG looks the same as what students see on screen.

const INK = "#1d1b2f";
const LINE = "#b9b2a3";
const SOFT = "#f6f1e7";
const FONT = "Inter, Helvetica, Arial, sans-serif";

function T({ x, y, children, size = 15, weight = 600, fill = INK, anchor = "middle", italic }) {
  return (
    <text x={x} y={y} fontSize={size} fontWeight={weight} fill={fill} textAnchor={anchor}
      fontFamily={FONT} fontStyle={italic ? "italic" : "normal"}>
      {children}
    </text>
  );
}
function Box({ x, y, w, h, label, sub, fill = "#fff", stroke = LINE, dash, r = 10, accent }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={stroke} strokeWidth="2"
        strokeDasharray={dash ? "6 5" : undefined} />
      {accent && <rect x={x} y={y} width={w} height="6" rx="3" fill={accent} />}
      {label && <T x={x + w / 2} y={y + 26} size={14}>{label}</T>}
      {sub && <T x={x + w / 2} y={y + 44} size={11} weight={400} fill="#6b6878">{sub}</T>}
    </g>
  );
}
function Arrow({ x1, y1, x2, y2, colour = INK }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const hx = (d, s) => x2 - 11 * Math.cos(a + s * d);
  const hy = (d, s) => y2 - 11 * Math.sin(a + s * d);
  return (
    <g stroke={colour} strokeWidth="2.2" fill="none" strokeLinecap="round">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <path d={`M${hx(0.45, 1)} ${hy(0.45, 1)} L${x2} ${y2} L${hx(0.45, -1)} ${hy(0.45, -1)}`} />
    </g>
  );
}
function Frame({ children, h = 360, title }) {
  return (
    <svg viewBox={`0 0 640 ${h}`} xmlns="http://www.w3.org/2000/svg" className="tpl-svg" role="img" aria-label={title + " template"}>
      <rect width="640" height={h} fill="#fff" />
      {children}
      <T x={624} y={h - 12} size={10} weight={400} fill="#9a95a6" anchor="end">The BCII Rollercoaster · {title}</T>
    </svg>
  );
}

const TEMPLATES = {
  backcasting: {
    title: "Backcasting",
    caption: "Start on the right with your desired future, then work left to today.",
    render: () => (
      <Frame title="Backcasting">
        <T x={320} y={34} size={18} weight={800}>Work backwards from the future</T>
        <line x1="40" y1="200" x2="600" y2="200" stroke={LINE} strokeWidth="3" />
        {[["Today", 40, "#0e9384"], ["Step 3", 180, INK], ["Step 2", 320, INK], ["Step 1", 460, INK]].map(([l, x, c]) => (
          <g key={l}>
            <circle cx={x + 50} cy="200" r="9" fill={c} />
            <Box x={x} y={226} w={100} h={96} dash label={l} sub={l === "Today" ? "first action" : "what happened?"} />
          </g>
        ))}
        <circle cx="580" cy="200" r="14" fill="#2f7d32" />
        <Box x={490} y={70} w={130} h={100} fill={SOFT} stroke="#2f7d32" label="Desired future" sub="when it succeeded" />
        <line x1="580" y1="170" x2="580" y2="186" stroke="#2f7d32" strokeWidth="2" />
        <Arrow x1={470} y1={150} x2={120} y2={150} colour="#e5484d" />
        <T x={300} y={140} size={12} fill="#e5484d">work backwards</T>
      </Frame>
    ),
  },
  "impact-matrix": {
    title: "Impact Matrix",
    caption: "Place each idea by how much difference it makes and how hard it is.",
    render: () => (
      <Frame title="Impact Matrix" h={400}>
        <Box x={90} y={30} w={250} h={160} fill="#eaf6ee" label="Quick wins" sub="high impact · low effort" />
        <Box x={350} y={30} w={250} h={160} fill={SOFT} label="Big bets" sub="high impact · high effort" />
        <Box x={90} y={200} w={250} h={160} fill="#fff" label="Fill-ins" sub="low impact · low effort" />
        <Box x={350} y={200} w={250} h={160} fill="#fdeeee" label="Avoid" sub="low impact · high effort" />
        <Arrow x1={70} y1={360} x2={70} y2={34} />
        <Arrow x1={90} y1={378} x2={600} y2={378} />
        <g transform="translate(46 195) rotate(-90)"><T x={0} y={0} size={13}>IMPACT</T></g>
        <T x={345} y={396} size={13}>EFFORT</T>
      </Frame>
    ),
  },
  "stakeholder-mapping": {
    title: "Stakeholder Map",
    caption: "Plot every stakeholder by influence and interest.",
    render: () => (
      <Frame title="Stakeholder Map" h={400}>
        <Box x={90} y={30} w={250} h={160} fill={SOFT} label="Keep satisfied" sub="high influence · low interest" />
        <Box x={350} y={30} w={250} h={160} fill="#eaf6ee" label="Manage closely" sub="high influence · high interest" />
        <Box x={90} y={200} w={250} h={160} label="Monitor" sub="low influence · low interest" />
        <Box x={350} y={200} w={250} h={160} fill="#eef0fd" label="Keep informed" sub="low influence · high interest" />
        <Arrow x1={70} y1={360} x2={70} y2={34} />
        <Arrow x1={90} y1={378} x2={600} y2={378} />
        <g transform="translate(46 195) rotate(-90)"><T x={0} y={0} size={13}>INFLUENCE</T></g>
        <T x={345} y={396} size={13}>INTEREST</T>
      </Frame>
    ),
  },
  "empathy-mapping": {
    title: "Empathy Map",
    caption: "Fill each quadrant from your interview notes.",
    render: () => (
      <Frame title="Empathy Map" h={420}>
        <Box x={30} y={20} w={285} h={150} label="SAYS" sub="quotes, in their words" />
        <Box x={325} y={20} w={285} h={150} label="THINKS" sub="what's on their mind" />
        <Box x={30} y={180} w={285} h={150} label="DOES" sub="actions and behaviour" />
        <Box x={325} y={180} w={285} h={150} label="FEELS" sub="emotions and worries" />
        <circle cx="320" cy="175" r="42" fill={SOFT} stroke={INK} strokeWidth="2" />
        <circle cx="320" cy="163" r="11" fill="none" stroke={INK} strokeWidth="2" />
        <path d="M300 195c3-12 37-12 40 0" fill="none" stroke={INK} strokeWidth="2" />
        <Box x={30} y={342} w={285} h={58} fill="#fdeeee" label="Pains" />
        <Box x={325} y={342} w={285} h={58} fill="#eaf6ee" label="Gains" />
      </Frame>
    ),
  },
  "user-journeys": {
    title: "User Journey",
    caption: "One column per stage. Draw the emotion line across the bottom row.",
    render: () => (
      <Frame title="User Journey" h={400}>
        {["Stage 1", "Stage 2", "Stage 3", "Stage 4", "Stage 5"].map((s, i) => (
          <g key={s}>
            <Box x={110 + i * 104} y={20} w={96} h={40} fill={SOFT} label={s} r={8} />
            {[0, 1].map((r) => <Box key={r} x={110 + i * 104} y={70 + r * 84} w={96} h={76} r={8} dash />)}
          </g>
        ))}
        {["Doing", "Thinking", "Feeling"].map((l, i) => <T key={l} x={60} y={115 + i * 84} size={13}>{l}</T>)}
        <rect x="110" y="240" width="512" height="120" rx="8" fill="#fff" stroke={LINE} strokeWidth="2" />
        <line x1="110" y1="300" x2="622" y2="300" stroke={LINE} strokeDasharray="4 4" />
        <T x={130} y={262} size={18}>☺</T><T x={130} y={350} size={18}>☹</T>
        <path d="M160 280 C220 260 250 340 310 330 S420 250 470 270 S560 330 610 300" fill="none" stroke="#e5484d" strokeWidth="3" strokeDasharray="8 6" />
        <T x={366} y={385} size={11} weight={400} fill="#6b6878">sketch the emotional highs and lows · circle the lowest points</T>
      </Frame>
    ),
  },
  "three-horizons": {
    title: "Three Horizons",
    caption: "H1 declines, H3 emerges, H2 is the bridge you can design.",
    render: () => (
      <Frame title="Three Horizons">
        <Arrow x1={50} y1={300} x2={50} y2={40} />
        <Arrow x1={50} y1={300} x2={610} y2={300} />
        <T x={330} y={330} size={12}>TIME</T>
        <path d="M60 70 C250 70 330 250 600 280" fill="none" stroke="#e5484d" strokeWidth="4" />
        <path d="M60 280 C200 270 260 90 360 90 C460 90 500 250 600 270" fill="none" stroke="#d97706" strokeWidth="4" />
        <path d="M60 290 C300 285 420 120 600 60" fill="none" stroke="#2f7d32" strokeWidth="4" />
        <T x={120} y={60} fill="#e5484d">H1 · today, declining</T>
        <T x={360} y={78} fill="#d97706">H2 · transition</T>
        <T x={540} y={50} fill="#2f7d32">H3 · emerging future</T>
      </Frame>
    ),
  },
  "crazy-8s": {
    title: "Crazy 8's",
    caption: "Fold A4 into eight. One sketch per minute.",
    render: () => (
      <Frame title="Crazy 8's">
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={i}>
            <Box x={30 + (i % 4) * 147} y={30 + Math.floor(i / 4) * 150} w={137} h={140} r={6} />
            <circle cx={50 + (i % 4) * 147} cy={50 + Math.floor(i / 4) * 150} r="12" fill={INK} />
            <T x={50 + (i % 4) * 147} y={55 + Math.floor(i / 4) * 150} size={12} fill="#fff">{i + 1}</T>
          </g>
        ))}
        <T x={320} y={348} size={12} weight={400} fill="#6b6878">⏱ 8 minutes · 1 minute per panel</T>
      </Frame>
    ),
  },
  "five-whys": {
    title: "5 Whys",
    caption: "Keep asking why until fixing the answer would fix the problem.",
    render: () => (
      <Frame title="5 Whys" h={420}>
        <Box x={170} y={16} w={300} h={50} fill="#fdeeee" stroke="#e5484d" label="Problem" />
        {[1, 2, 3, 4, 5].map((n) => (
          <g key={n}>
            <Arrow x1={320} y1={66 + (n - 1) * 62} x2={320} y2={80 + (n - 1) * 62} />
            <Box x={170} y={80 + (n - 1) * 62} w={300} h={48} dash />
            <T x={196} y={110 + (n - 1) * 62} size={13} anchor="start">Why {n}?</T>
          </g>
        ))}
        <T x={320} y={402} size={13} fill="#2f7d32">✓ Root cause: if we fixed this, would the problem go away?</T>
      </Frame>
    ),
  },
  cla: {
    title: "Causal Layered Analysis",
    caption: "Go down the iceberg, then try rewriting the deepest layer.",
    render: () => (
      <Frame title="Causal Layered Analysis" h={380}>
        <path d="M40 90 L600 90" stroke="#5b9bd5" strokeWidth="2" strokeDasharray="6 5" />
        <T x={590} y={82} size={11} fill="#5b9bd5" anchor="end">waterline</T>
        {[["Litany", "headlines, complaints", 230, 30, "#fdeeee"], ["Systemic causes", "social, economic, technical", 180, 100, "#fbf1de"],
          ["Worldview", "beliefs that make it normal", 130, 175, "#eef0fd"], ["Myth / metaphor", "the deep story underneath", 80, 250, "#eaf6ee"]].map(([l, s, x, y, f]) => (
          <Box key={l} x={x} y={y} w={640 - 2 * x} h={64} fill={f} label={l} sub={s} />
        ))}
      </Frame>
    ),
  },
  "ball-in-basin": {
    title: "Ball in the Basin",
    caption: "What holds the ball in place? What would tip it into a better basin?",
    render: () => (
      <Frame title="Ball in the Basin">
        <path d="M30 120 C120 120 130 280 230 280 S330 140 380 140 S470 250 530 250 S600 170 620 170" fill="none" stroke={INK} strokeWidth="4" />
        <circle cx="230" cy="262" r="17" fill="#e5484d" />
        <T x={230} y={312}>Current state</T>
        <T x={530} y={290}>Better state</T>
        <Arrow x1={260} y1={230} x2={340} y2={170} colour="#2f7d32" />
        <Box x={40} y={30} w={250} h={70} dash label="Forces keeping it here" />
        <Box x={360} y={30} w={250} h={70} dash label="What tips it over the rim?" />
      </Frame>
    ),
  },
  hmw: {
    title: "How Might We",
    caption: "Write several versions, then vote on the ones that spark ideas.",
    render: () => (
      <Frame title="How Might We" h={330}>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <Box x={30} y={24 + i * 96} w={580} h={84} fill={i === 0 ? SOFT : "#fff"} />
            <T x={50} y={60 + i * 96} size={17} weight={800} anchor="start">How might we</T>
            <line x1="185" y1="64" x2="420" y2="64" stroke={LINE} strokeWidth="2" transform={`translate(0 ${i * 96})`} />
            <T x={430} y={60 + i * 96} size={15} anchor="start">for</T>
            <line x1="460" y1="64" x2="590" y2="64" stroke={LINE} strokeWidth="2" transform={`translate(0 ${i * 96})`} />
            <T x={50} y={92 + i * 96} size={13} weight={400} anchor="start" fill="#6b6878">so that ________________________________________ ?</T>
          </g>
        ))}
      </Frame>
    ),
  },
  "problem-statement": {
    title: "Problem Statement",
    caption: "One sentence the whole team can stand behind. No solutions inside it.",
    render: () => (
      <Frame title="Problem Statement" h={240}>
        <Box x={30} y={60} w={170} h={90} fill="#eef0fd" label="[User]" sub="who exactly?" />
        <T x={225} y={110} size={18} weight={800}>needs</T>
        <Box x={250} y={60} w={170} h={90} fill={SOFT} label="[Need]" sub="a verb, not a feature" />
        <T x={455} y={110} size={18} weight={800}>because</T>
        <Box x={490} y={60} w={120} h={90} fill="#eaf6ee" label="[Insight]" sub="what you learnt" />
        <T x={320} y={190} size={12} weight={400} fill="#6b6878">✗ contains a solution?  ✗ too broad?  ✓ could guide a decision tomorrow?</T>
      </Frame>
    ),
  },
  "insights-framework": {
    title: "Insights Framework",
    caption: "Turn each pattern into an insight with this sentence.",
    render: () => (
      <Frame title="Insights Framework" h={300}>
        {[["We noticed…", "the observation", "#eef0fd"], ["because…", "the reason behind it", SOFT], ["which means…", "the design implication", "#eaf6ee"]].map(([l, s, f], i) => (
          <g key={l}>
            <Box x={30} y={24 + i * 84} w={580} h={72} fill={f} />
            <T x={54} y={56 + i * 84} size={18} weight={800} anchor="start">{l}</T>
            <T x={54} y={80 + i * 84} size={12} weight={400} anchor="start" fill="#6b6878">{s}</T>
            {i < 2 && <Arrow x1={320} y1={96 + i * 84} x2={320} y2={108 + i * 84} />}
          </g>
        ))}
      </Frame>
    ),
  },
  bracketology: {
    title: "Bracketology",
    caption: "Two ideas at a time. The winner moves right.",
    render: () => (
      <Frame title="Bracketology" h={380}>
        {Array.from({ length: 8 }).map((_, i) => <Box key={i} x={20} y={16 + i * 42} w={140} h={32} r={6} dash />)}
        {Array.from({ length: 4 }).map((_, i) => <Box key={i} x={210} y={37 + i * 84} w={130} h={32} r={6} />)}
        {Array.from({ length: 2 }).map((_, i) => <Box key={i} x={390} y={79 + i * 168} w={120} h={32} r={6} />)}
        <Box x={540} y={150} w={84} h={50} fill={SOFT} stroke="#d97706" label="🏆" />
        {Array.from({ length: 4 }).map((_, i) => (
          <path key={i} d={`M160 ${32 + i * 84} H185 V${74 + i * 84} H160 M185 ${53 + i * 84} H210`} fill="none" stroke={LINE} strokeWidth="2" />
        ))}
        {Array.from({ length: 2 }).map((_, i) => (
          <path key={i} d={`M340 ${53 + i * 168} H365 V${137 + i * 168} H340 M365 ${95 + i * 168} H390`} fill="none" stroke={LINE} strokeWidth="2" />
        ))}
        <path d="M510 95 H525 V263 H510 M525 175 H540" fill="none" stroke={LINE} strokeWidth="2" />
      </Frame>
    ),
  },
  scamper: {
    title: "SCAMPER",
    caption: "Run your idea through each prompt and jot what comes out.",
    render: () => (
      <Frame title="SCAMPER" h={420}>
        {[["S", "Substitute", "what could we swap?"], ["C", "Combine", "what could we merge?"], ["A", "Adapt", "what could we borrow?"], ["M", "Modify", "what could we change?"],
          ["P", "Put to other use", "who else could use it?"], ["E", "Eliminate", "what could we remove?"], ["R", "Reverse", "what if we flipped it?"]].map(([k, l, s], i) => (
          <g key={k}>
            <circle cx="50" cy={40 + i * 54} r="20" fill={INK} />
            <T x={50} y={46 + i * 54} size={17} weight={800} fill="#fff">{k}</T>
            <T x={82} y={38 + i * 54} size={14} anchor="start">{l}</T>
            <T x={82} y={55 + i * 54} size={11} weight={400} anchor="start" fill="#6b6878">{s}</T>
            <rect x="260" y={20 + i * 54} width="350" height="42" rx="8" fill="#fff" stroke={LINE} strokeWidth="2" strokeDasharray="6 5" />
          </g>
        ))}
      </Frame>
    ),
  },
  "day-in-life": {
    title: "A Day in the Life",
    caption: "Map one person's whole day. Mark where your problem shows up.",
    render: () => (
      <Frame title="A Day in the Life" h={300}>
        <line x1="40" y1="120" x2="600" y2="120" stroke={LINE} strokeWidth="4" strokeLinecap="round" />
        {[["☀", "Morning", 60], ["🕛", "Midday", 230], ["🌇", "Afternoon", 400], ["🌙", "Night", 570]].map(([e, l, x]) => (
          <g key={l}>
            <T x={x} y={70} size={26}>{e}</T>
            <T x={x} y={100} size={13}>{l}</T>
            <circle cx={x} cy="120" r="7" fill={INK} />
            <Box x={x - 70} y={145} w={140} h={110} dash sub="what they're doing · where the problem appears" />
          </g>
        ))}
      </Frame>
    ),
  },
  "actor-constellation": {
    title: "Actor Constellation",
    caption: "Closer to the centre means more influence on your user.",
    render: () => (
      <Frame title="Actor Constellation" h={380}>
        {[160, 110, 60].map((r, i) => <circle key={r} cx="320" cy="185" r={r} fill={["#fff", SOFT, "#eef0fd"][i]} stroke={LINE} strokeWidth="2" />)}
        <circle cx="320" cy="185" r="26" fill={INK} />
        <T x={320} y={190} size={11} fill="#fff">USER</T>
        {[[320, 40], [460, 180], [200, 300], [420, 300], [190, 110]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="18" fill="#fff" stroke={INK} strokeWidth="2" strokeDasharray="4 3" />
        ))}
        <T x={560} y={60} size={12} weight={400} fill="#6b6878">draw lines between actors</T>
        <T x={560} y={78} size={12} weight={400} fill="#6b6878">and label them</T>
      </Frame>
    ),
  },
  "double-diamond": {
    title: "Double Diamond",
    caption: "Each teammate marks where they think the project is right now.",
    render: () => (
      <Frame title="Double Diamond" h={300}>
        <path d="M30 140 L170 40 L170 240 Z" fill="#0e9384" opacity=".22" />
        <path d="M170 40 L310 140 L170 240 Z" fill="#e5484d" opacity=".22" />
        <path d="M330 140 L470 40 L470 240 Z" fill="#d97706" opacity=".22" />
        <path d="M470 40 L610 140 L470 240 Z" fill="#2f7d32" opacity=".22" />
        <path d="M30 140 L170 40 L310 140 L170 240 Z M330 140 L470 40 L610 140 L470 240 Z" fill="none" stroke={INK} strokeWidth="2" />
        <T x={110} y={145}>Discover</T><T x={235} y={145}>Define</T><T x={405} y={145}>Develop</T><T x={535} y={145}>Deliver</T>
        <T x={320} y={132} size={10} weight={400} fill="#6b6878">challenge</T>
        <T x={320} y={276} size={12} weight={400} fill="#6b6878">add a dot with your initials where you think the team is · talk about any spread</T>
      </Frame>
    ),
  },
  "theory-u": {
    title: "Theory U",
    caption: "Go down the left side, pause at the bottom, come up the right.",
    render: () => (
      <Frame title="Theory U" h={340}>
        <path d="M80 40 C80 300 560 300 560 40" fill="none" stroke={INK} strokeWidth="4" />
        <Box x={20} y={50} w={130} h={56} label="Co-initiating" />
        <Box x={60} y={160} w={140} h={56} label="Co-sensing" />
        <Box x={250} y={248} w={140} h={56} fill={SOFT} label="Presencing" />
        <Box x={440} y={160} w={140} h={56} label="Co-creating" />
        <Box x={490} y={50} w={130} h={56} label="Co-evolving" />
      </Frame>
    ),
  },
  "causal-maps": {
    title: "Causal Map",
    caption: "Arrows show what causes what. Look for loops.",
    render: () => (
      <Frame title="Causal Map" h={360}>
        <Box x={240} y={150} w={160} h={60} fill="#fdeeee" stroke="#e5484d" label="The problem" />
        {[[40, 40], [250, 20], [470, 40], [40, 270], [470, 270]].map(([x, y], i) => (
          <Box key={i} x={x} y={y} w={130} h={50} dash sub="cause" />
        ))}
        <Arrow x1={170} y1={80} x2={250} y2={150} /><Arrow x1={315} y1={70} x2={318} y2={146} />
        <Arrow x1={470} y1={80} x2={395} y2={150} /><Arrow x1={170} y1={285} x2={245} y2={210} />
        <path d="M400 210 C460 230 470 260 500 268" fill="none" stroke="#d97706" strokeWidth="2.2" />
        <Arrow x1={470} y1={270} x2={400} y2={208} colour="#d97706" />
        <T x={560} y={350} size={11} weight={400} fill="#d97706" anchor="end">↻ loop = leverage point</T>
      </Frame>
    ),
  },
};

export function hasTemplate(id) {
  return !!TEMPLATES[id];
}

export function templateInfo(id) {
  return TEMPLATES[id];
}

export default function Template({ id }) {
  const t = TEMPLATES[id];
  if (!t) return null;
  return (
    <figure className="tpl" id={"tpl-" + id}>
      {t.render()}
      <figcaption>
        <span>{t.caption}</span>
        <span className="tpl-actions">
          <button className="mini" onClick={() => downloadPng(id, t.title)}>⬇ Download PNG</button>
        </span>
      </figcaption>
    </figure>
  );
}

// Draw the SVG onto a canvas so students can drop the template into Miro, Canva or a doc.
function downloadPng(id, title) {
  const svg = document.querySelector(`#tpl-${id} svg`);
  if (!svg) return;
  const xml = new XMLSerializer().serializeToString(svg);
  const vb = svg.viewBox.baseVal;
  const scale = 3;
  const img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas");
    c.width = vb.width * scale;
    c.height = vb.height * scale;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0, c.width, c.height);
    const a = document.createElement("a");
    a.download = title.replace(/[^a-z0-9]+/gi, "-").toLowerCase() + "-template.png";
    a.href = c.toDataURL("image/png");
    a.click();
  };
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
}
