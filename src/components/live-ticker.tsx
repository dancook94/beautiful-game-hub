"use client"

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import type { LiveMatch, LiveScoresResponse } from "@/lib/types"

function statusTone(status: LiveMatch["status"]) {
  if (status === "LIVE") return "bg-primary text-primary-foreground"
  if (status === "HT") return "bg-amber-400/20 text-amber-200"
  if (status === "FT") return "bg-foreground/10 text-muted-foreground"
  return "bg-sky-400/15 text-sky-200"
}

function MatchChip({ match }: { match: LiveMatch }) {
  return (
    <div className="flex shrink-0 items-center gap-3 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 pr-4 backdrop-blur-md">
      <Badge className={statusTone(match.status)}>
        {match.status === "LIVE" && match.minute != null
          ? `${match.minute}'`
          : match.status}
      </Badge>
      <span className="text-[0.65rem] tracking-[0.18em] text-primary/80 uppercase">
        {match.competitionShort}
      </span>
      <span className="font-heading text-sm text-foreground">
        {match.home.short}{" "}
        <span className="text-primary tabular-nums">
          {match.home.score}–{match.away.score}
        </span>{" "}
        {match.away.short}
      </span>
    </div>
  )
}

export function LiveTicker() {
  const [matches, setMatches] = useState<LiveMatch[]>([])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch("/api/live-scores", { cache: "no-store" })
        if (!res.ok) return
        const data = (await res.json()) as LiveScoresResponse
        if (!cancelled) setMatches(data.matches)
      } catch {
        /* mock ticker stays empty until the API is reachable */
      }
    }

    load()
    const id = window.setInterval(load, 12_000)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [])

  const loop = useMemo(
    () => (matches.length ? [...matches, ...matches] : []),
    [matches]
  )

  return (
    <div
      id="live"
      className="sticky top-16 z-40 border-b border-primary/20 bg-[#070b07]/90 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 px-3 py-2 sm:px-4">
        <div className="flex shrink-0 items-center gap-2">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
          </span>
          <span className="font-heading hidden text-[0.65rem] tracking-[0.22em] text-primary uppercase sm:inline">
            Live ticker
          </span>
        </div>
        <div className="ticker-mask min-w-0 flex-1 overflow-hidden">
          {loop.length === 0 ? (
            <p className="text-sm text-muted-foreground">Calling the ground…</p>
          ) : (
            <div className="animate-ticker flex w-max gap-3">
              {loop.map((match, index) => (
                <MatchChip key={`${match.id}-${index}`} match={match} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
