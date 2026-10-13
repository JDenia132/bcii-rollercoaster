import { METHODS, byId } from "../../../lib/methods";

// Server only. The API key never reaches the browser.
const MODEL = "claude-sonnet-5-5";

const methodList = METHODS.map(
  (m) => `${m.id} | ${m.name} | ${m.phases.join(",")} | ${m.when}`
).join("\n");

const SYSTEM = `You help UTS BCII students who are stuck on a group design project. Projects follow the Double Diamond, which this tool presents as a rollercoaster:
- Discover = the climb (diverge: understand the problem, system and people)
- Define = the first drop (converge: turn research into one clear challenge)
- Develop = the loops (diverge: generate and build ideas)
- Deliver = the home stretch (converge: prototype, test, refine)

Students often don't know the root cause of being stuck, and group dynamics muddy it. Read their symptoms carefully and diagnose which phase they are REALLY in, which may be earlier than where they think they are. If they are trying to ideate without a clear problem, tell them kindly to step back. If the trouble is team friction, consider methods that create shared understanding (e.g. pause, sensemaking, problem-statement, double-diamond).

Students often default to methods they already know. Prefer at least one method they may not have tried, and do not recommend anything they say they already tried.

Pick exactly 3 methods from this list (use the id exactly):
${methodList}

Students skim, so keep every field SHORT. Reply with ONLY a JSON object, no markdown, in this shape:
{"phase":"discover|define|develop|deliver","stepBack":true|false,"diagnosis":"one sentence, max 20 words, on what is really going on","picks":[{"id":"method-id","why":"max 12 words","firstStep":"max 12 words, starting with a verb"}]}
Order the 3 picks as a route: the first is what to do now, the third is where it leads.

Write in plain Australian English, warm and direct. Never use em dashes.`;

export async function POST(req) {
  // Local preview only: set MOCK_AI=1 to see the result screen without an API key.
  if (process.env.MOCK_AI === "1") {
    return Response.json({
      phase: "define",
      stepBack: true,
      diagnosis: "You're ideating before agreeing on the problem, so every idea feels like an argument.",
      picks: [
        { id: "sensemaking", why: "Gets everyone's research onto one wall first.", firstStep: "Each person shares their top three findings, no debate." },
        { id: "problem-statement", why: "One sentence the whole team signs off on.", firstStep: "Everyone writes a draft statement alone in five minutes." },
        { id: "hmw", why: "Turns the agreed problem into questions you can ideate on.", firstStep: "Rewrite your statement as five How Might We questions." },
      ],
    });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "The assistant isn't set up yet (missing API key on the server)." },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Bad request." }, { status: 400 });
  }

  const stuck = String(body.stuck || "").slice(0, 1500);
  const symptoms = Array.isArray(body.symptoms) ? body.symptoms.slice(0, 10).map(String) : [];
  const tried = String(body.tried || "").slice(0, 600);
  const deadline = String(body.deadline || "").slice(0, 60);

  if (!stuck.trim() && symptoms.length === 0) {
    return Response.json(
      { error: "Pick a symptom or describe what's going on first." },
      { status: 400 }
    );
  }

  const userMsg = [
    symptoms.length ? `Symptoms we picked: ${symptoms.join("; ")}` : "",
    stuck ? `In our words: ${stuck}` : "",
    tried ? `Already tried: ${tried}` : "",
    deadline ? `Deadline: ${deadline}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 900,
        system: SYSTEM,
        messages: [{ role: "user", content: userMsg }],
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      console.error("Anthropic error", res.status, t);
      return Response.json(
        { error: "The assistant is having trouble right now. Try again in a minute, or browse the library." },
        { status: 502 }
      );
    }

    const data = await res.json();
    const text = (data.content || []).map((c) => c.text || "").join("");
    const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));

    const picks = (json.picks || [])
      .filter((p) => byId[p.id])
      .slice(0, 3)
      .map((p) => ({ id: p.id, why: String(p.why || ""), firstStep: String(p.firstStep || "") }));

    if (!picks.length) throw new Error("No valid picks");

    return Response.json({
      phase: ["discover", "define", "develop", "deliver"].includes(json.phase) ? json.phase : null,
      stepBack: !!json.stepBack,
      diagnosis: String(json.diagnosis || ""),
      picks,
    });
  } catch (e) {
    console.error(e);
    return Response.json(
      { error: "Couldn't read the assistant's answer. Try rephrasing, or browse the library." },
      { status: 502 }
    );
  }
}
