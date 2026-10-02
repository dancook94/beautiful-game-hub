import { incrementGoalVote, isGoalId, readGoalVotes } from "@/lib/goal-votes"

export const dynamic = "force-dynamic"

const noStore = { "Cache-Control": "no-store" }

export async function GET() {
  try {
    const board = await readGoalVotes()
    return Response.json(board, { headers: noStore })
  } catch {
    return Response.json(
      { error: "Vote store unavailable" },
      { status: 503, headers: noStore }
    )
  }
}

export async function POST(request: Request) {
  let body: { goalId?: string }
  try {
    body = (await request.json()) as { goalId?: string }
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (!body?.goalId || !isGoalId(body.goalId)) {
    return Response.json({ error: "Unknown goal" }, { status: 404 })
  }

  try {
    const board = await incrementGoalVote(body.goalId)
    if (!board) {
      return Response.json({ error: "Unknown goal" }, { status: 404 })
    }
    return Response.json(board, { headers: noStore })
  } catch {
    return Response.json(
      { error: "Vote store unavailable" },
      { status: 503, headers: noStore }
    )
  }
}
