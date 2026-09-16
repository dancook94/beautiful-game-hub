import { PREDICTION_FIXTURES } from "@/lib/data"
import type { PredictionPick, PredictionsResponse, PredictionVote } from "@/lib/types"

export const dynamic = "force-dynamic"

const VALID_PICKS: PredictionPick[] = ["home", "draw", "away"]

const tally: Record<string, Record<PredictionPick, number>> = Object.fromEntries(
  PREDICTION_FIXTURES.map((fixture) => [
    fixture.id,
    {
      home: fixture.community.home,
      draw: fixture.community.draw,
      away: fixture.community.away,
    },
  ])
)

function withCommunity(): PredictionsResponse {
  return {
    week: "Matchweek 7 · mock board",
    submitted: Object.values(tally).reduce(
      (sum, row) => sum + row.home + row.draw + row.away,
      0
    ),
    fixtures: PREDICTION_FIXTURES.map((fixture) => {
      const votes = tally[fixture.id]
      const total = Math.max(1, votes.home + votes.draw + votes.away)
      return {
        ...fixture,
        community: {
          home: Math.round((votes.home / total) * 100),
          draw: Math.round((votes.draw / total) * 100),
          away: Math.round((votes.away / total) * 100),
        },
      }
    }),
  }
}

export function GET() {
  return Response.json(withCommunity(), {
    headers: { "Cache-Control": "no-store" },
  })
}

export async function POST(request: Request) {
  let body: PredictionVote
  try {
    body = (await request.json()) as PredictionVote
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (!body?.fixtureId || !VALID_PICKS.includes(body.pick)) {
    return Response.json({ error: "Need fixtureId and pick" }, { status: 400 })
  }

  if (!tally[body.fixtureId]) {
    return Response.json({ error: "Unknown fixture" }, { status: 404 })
  }

  tally[body.fixtureId][body.pick] += 1

  return Response.json({
    ok: true,
    pick: body.pick,
    fixtureId: body.fixtureId,
    board: withCommunity(),
  })
}
