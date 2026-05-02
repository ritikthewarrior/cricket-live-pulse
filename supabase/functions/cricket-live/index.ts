// Edge function: proxies CricketData.org (api.cricapi.com/v1) and returns
// a normalized snapshot of the first live match plus its scorecard.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const BASE = "https://api.cricapi.com/v1";

async function cd(path: string, key: string, extra: Record<string, string> = {}) {
  const url = new URL(`${BASE}/${path}`);
  url.searchParams.set("apikey", key);
  for (const [k, v] of Object.entries(extra)) url.searchParams.set(k, v);
  const r = await fetch(url.toString());
  const text = await r.text();
  let json: any;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!r.ok) throw new Error(`CricketData ${path} ${r.status}: ${text.slice(0, 200)}`);
  return json;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const key = Deno.env.get("CRICKETDATA_API_KEY");
    if (!key) throw new Error("CRICKETDATA_API_KEY is not configured");

    const url = new URL(req.url);
    const matchIdParam = url.searchParams.get("matchId");

    // 1. Pick the match: explicit ?matchId=... or first live from currentMatches
    let matchId = matchIdParam;
    let summary: any = null;

    if (!matchId) {
      const current = await cd("currentMatches", key, { offset: "0" });
      const list: any[] = current?.data ?? [];
      // Prefer an actually live match
      const live = list.find((m) => m.matchStarted && !m.matchEnded) ?? list[0];
      if (!live) {
        return new Response(
          JSON.stringify({ ok: false, error: "No current matches available" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      matchId = live.id;
      summary = live;
    }

    // 2. Fetch scorecard for richer details
    let scorecard: any = null;
    try {
      scorecard = await cd("match_scorecard", key, { id: matchId! });
    } catch (e) {
      console.log("scorecard fetch failed", (e as Error).message);
    }

    // 3. Fetch match info if we don't have summary yet
    if (!summary) {
      try {
        const info = await cd("match_info", key, { id: matchId! });
        summary = info?.data ?? null;
      } catch (e) {
        console.log("match_info fetch failed", (e as Error).message);
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        matchId,
        summary,
        scorecard: scorecard?.data ?? null,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("cricket-live error", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ ok: false, error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
