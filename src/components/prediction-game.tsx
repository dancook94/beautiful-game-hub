"use client"

import { useEffect, useState } from "react"
import { PREDICTION_FIXTURES } from "@/lib/data"
import type {
  PredictionPick,
  PredictionFixture,
  PredictionsResponse,
} from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const STORAGE_KEY = "bgh-predictions"

const PICKS: { id: PredictionPick; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "draw", label: "Draw" },
  { id: "away", label: "Away" },
]

function readLocal(): Record<string, PredictionPick> {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, PredictionPick>) : {}
  } catch {
    return {}
  }
}

export function PredictionGame() {
  const [fixtures, setFixtures] = useState<PredictionFixture[]>(PREDICTION_FIXTURES)
  const [week, setWeek] = useState("Matchweek 7")
  const [picks, setPicks] = useState<Record<string, PredictionPick>>({})
  const [busy, setBusy] = useState<string | null>(null)

  useEffect(() => {
    setPicks(readLocal())
    fetch("/api/predictions", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: PredictionsResponse) => {
        setFixtures(data.fixtures)
        setWeek(data.week)
      })
      .catch(() => {
        /* keep bundled mock fixtures */
      })
  }, [])

  async function choose(fixtureId: string, pick: PredictionPick) {
    const next = { ...picks, [fixtureId]: pick }
    setPicks(next)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setBusy(fixtureId)
    try {
      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fixtureId, pick }),
      })
      if (res.ok) {
        const data = (await res.json()) as { board: PredictionsResponse }
        if (data.board?.fixtures) setFixtures(data.board.fixtures)
      }
    } finally {
      setBusy(null)
    }
  }

  const locked = Object.keys(picks).length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{week}</p>
        <Badge variant="outline">
          {locked}/{fixtures.length} slips stored locally
        </Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {fixtures.map((fixture) => {
          const selected = picks[fixture.id]
          return (
            <Card key={fixture.id} className="bg-[#0d140d] ring-primary/15">
              <CardHeader>
                <p className="text-[0.65rem] tracking-[0.2em] text-primary uppercase">
                  {fixture.competition}
                </p>
                <CardTitle className="font-heading text-xl">
                  {fixture.home}{" "}
                  <span className="text-muted-foreground">vs</span> {fixture.away}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {fixture.kickoff} · {fixture.venue}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {PICKS.map((option) => (
                    <Button
                      key={option.id}
                      variant={selected === option.id ? "default" : "outline"}
                      disabled={busy === fixture.id}
                      onClick={() => choose(fixture.id, option.id)}
                    >
                      {option.id === "home"
                        ? fixture.home.split(" ").slice(-1)
                        : option.id === "away"
                          ? fixture.away.split(" ").slice(-1)
                          : "Draw"}
                    </Button>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Home {fixture.community.home}%</span>
                    <span>Draw {fixture.community.draw}%</span>
                    <span>Away {fixture.community.away}%</span>
                  </div>
                  <Progress value={fixture.community.home} className="h-1.5" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Picks live in <code>localStorage</code> under{" "}
        <code className="text-primary">{STORAGE_KEY}</code> and ping the mock
        community board at <code>/api/predictions</code>. No stakes. No shop.
      </p>
    </div>
  )
}
