# PURPOSERA

A mission-first network. Describe something you want to build, and PURPOSERA maps
the capabilities it depends on, the roles you're missing, the people already here
whose skills fit, and the first move worth making this week.

> The question changes from "who do I know?" to "who should exist around this mission?"

## Running it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Gemini

Analysis runs server-side through the Gemini Interactions API. Copy the example
env file and add a key from [AI Studio](https://aistudio.google.com/apikey):

```bash
cp .env.example .env.local
```

| Variable | Default | Notes |
| --- | --- | --- |
| `GEMINI_API_KEY` | — | Server-side only. Never exposed to the browser. |
| `GEMINI_MODEL` | `gemini-3.5-flash-lite` | ~11s on the full schema, which keeps a live demo tight. |
| `GEMINI_FALLBACK_MODEL` | `gemini-3.1-flash-lite` | Used only if the primary model is overloaded. |

**Without a key the app still works.** If Gemini is unconfigured, times out,
returns invalid JSON, or is overloaded, `/api/analyze` falls back to a
keyword-driven analyser that still produces a mission-specific map. The page
never breaks, and provider errors are logged server-side rather than surfaced.

## How it fits together

```
app/api/analyze   validate → Gemini (one structured call) → normalize → fallback
lib/prompt.ts     system instruction + JSON schema
lib/ai.ts         Interactions API client, timeout + one retry
lib/normalize.ts  coerces model output into typed data
lib/fallback.ts   keyword-driven analyser used when the model is unavailable
lib/match.ts      matches network members to capabilities by skill overlap
lib/graph.ts      analysis → React Flow nodes, edges and detail payloads
```

Model output is rendered as structured data, never as HTML. The only formatting
honoured is `**emphasis**`, parsed into `<strong>` in `lib/rich.ts`.

## The network

`lib/members.ts` holds a seeded directory of **sample profiles** — they are not
real people. It demonstrates the interaction model: a mission surfaces members
whose stated skills line up with what's missing. Requests stay in the browser;
nothing is sent to anyone.

## Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```
