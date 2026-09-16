import { buildLiveScores } from "@/lib/data"
import type { LiveScoresResponse } from "@/lib/types"

export const dynamic = "force-dynamic"

export function GET() {
  const payload: LiveScoresResponse = {
    generatedAt: new Date().toISOString(),
    matches: buildLiveScores(),
  }

  return Response.json(payload, {
    headers: {
      "Cache-Control": "no-store",
    },
  })
}
