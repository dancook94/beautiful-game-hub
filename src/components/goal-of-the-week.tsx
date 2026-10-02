"use client"

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react"
import Image from "next/image"
import { CheckIcon, PlayIcon, XIcon } from "lucide-react"

import { GOALS_OF_THE_WEEK } from "@/lib/data"
import type { GoalClip, GoalVotesResponse } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

const STORAGE_KEY = "bgh-goal-votes"

const SEED_VOTES: Record<string, number> = Object.fromEntries(
  GOALS_OF_THE_WEEK.map((goal) => [goal.id, goal.votes])
)

const EMPTY_VOTES = "[]"
const voteListeners = new Set<() => void>()
let votedSnapshot = EMPTY_VOTES

function parseVoted(raw: string): string[] {
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : []
  } catch {
    return []
  }
}

function subscribeVoted(listener: () => void) {
  voteListeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) listener()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    voteListeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

function getVotedSnapshot() {
  try {
    const next = window.localStorage.getItem(STORAGE_KEY) ?? EMPTY_VOTES
    if (next !== votedSnapshot) votedSnapshot = next
    return votedSnapshot
  } catch {
    return votedSnapshot
  }
}

function getVotedServerSnapshot() {
  return EMPTY_VOTES
}

function writeVoted(ids: string[]) {
  const next = JSON.stringify(ids)
  try {
    window.localStorage.setItem(STORAGE_KEY, next)
  } catch {
    /* private mode still keeps the in-memory snapshot */
  }
  votedSnapshot = next
  for (const listener of voteListeners) listener()
}

function posterUrl(youtubeId: string) {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
}

function embedUrl(youtubeId: string) {
  const params = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  })
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?${params}`
}

export function GoalOfTheWeek() {
  const [votes, setVotes] = useState<Record<string, number>>(SEED_VOTES)
  const votedRaw = useSyncExternalStore(
    subscribeVoted,
    getVotedSnapshot,
    getVotedServerSnapshot
  )
  const votedIds = useMemo(() => parseVoted(votedRaw), [votedRaw])
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [voteErrorId, setVoteErrorId] = useState<string | null>(null)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const generation = useRef(0)
  const pendingRef = useRef<string | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const requestId = ++generation.current
    fetch("/api/goal-votes", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: GoalVotesResponse | null) => {
        if (!data?.votes || requestId !== generation.current) return
        setVotes(data.votes)
      })
      .catch(() => {
        /* keep the seeded counts */
      })
  }, [])

  useEffect(() => {
    if (!carouselApi) return
    const stop = () => setPlayingId(null)
    carouselApi.on("select", stop)
    return () => {
      carouselApi.off("select", stop)
    }
  }, [carouselApi])

  useEffect(() => {
    if (playingId) closeButtonRef.current?.focus()
  }, [playingId])

  const leaderTotal = Math.max(...Object.values(votes))

  function closeClip(goalId: string) {
    setPlayingId(null)
    window.requestAnimationFrame(() => {
      document.getElementById(`play-goal-${goalId}`)?.focus()
    })
  }

  async function castVote(goal: GoalClip) {
    if (pendingRef.current) return
    const saved = parseVoted(getVotedSnapshot())
    if (saved.includes(goal.id)) return

    const nextVoted = [...saved, goal.id]
    const previous = votes[goal.id] ?? goal.votes
    const requestId = ++generation.current
    pendingRef.current = goal.id

    setVoteErrorId(null)
    writeVoted(nextVoted)
    setVotes((current) => ({
      ...current,
      [goal.id]: (current[goal.id] ?? goal.votes) + 1,
    }))
    setPendingId(goal.id)

    try {
      const res = await fetch("/api/goal-votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalId: goal.id }),
      })
      if (!res.ok) throw new Error("Vote failed")
      const data = (await res.json()) as GoalVotesResponse
      if (requestId === generation.current && data.votes) {
        setVotes(data.votes)
      }
    } catch {
      if (requestId === generation.current) {
        setVotes((current) => ({ ...current, [goal.id]: previous }))
      }
      const rolledBack = parseVoted(getVotedSnapshot()).filter(
        (id) => id !== goal.id
      )
      writeVoted(rolledBack)
      setVoteErrorId(goal.id)
    } finally {
      if (pendingRef.current === goal.id) pendingRef.current = null
      setPendingId((current) => (current === goal.id ? null : current))
    }
  }

  return (
    <Carousel
      opts={{ align: "start", loop: true }}
      setApi={setCarouselApi}
      className="w-full"
    >
      <CarouselContent>
        {GOALS_OF_THE_WEEK.map((goal, index) => {
          const count = votes[goal.id] ?? goal.votes
          const hasVoted = votedIds.includes(goal.id)
          const isLeading = count === leaderTotal
          const isPlaying = playingId === goal.id

          return (
            <CarouselItem
              key={goal.id}
              className="basis-full md:basis-4/5 lg:basis-3/5"
            >
              <Card className="h-full overflow-hidden bg-[#0d140d] ring-primary/15">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0a0f0a]">
                  {isPlaying ? (
                    <>
                      <iframe
                        className="absolute inset-0 size-full"
                        src={embedUrl(goal.youtubeId)}
                        title={`${goal.player} goal against ${goal.opponent}, ${goal.competition}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                      <Button
                        ref={isPlaying ? closeButtonRef : undefined}
                        type="button"
                        size="icon-sm"
                        variant="outline"
                        className="absolute top-3 right-3 z-10 border-white/20 bg-[#0a0f0a]/80 text-foreground hover:bg-[#0a0f0a]"
                        aria-label={`Close the clip of ${goal.player} against ${goal.opponent}`}
                        onClick={() => closeClip(goal.id)}
                      >
                        <XIcon />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Image
                        src={posterUrl(goal.youtubeId)}
                        alt={goal.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 60vw, (min-width: 768px) 80vw, 100vw"
                        className="object-cover"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#0a0f0a] via-[#0a0f0a]/25 to-transparent" />
                      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                        <Badge>GOTW #{index + 1}</Badge>
                        {isLeading ? (
                          <Badge className="border border-primary/40 bg-[#0a0f0a] text-primary">
                            Leading
                          </Badge>
                        ) : null}
                      </div>
                      <Button
                        id={`play-goal-${goal.id}`}
                        type="button"
                        size="icon-lg"
                        className="absolute top-1/2 left-1/2 z-10 size-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
                        aria-label={`Play ${goal.player}'s goal against ${goal.opponent}`}
                        onClick={() => setPlayingId(goal.id)}
                      >
                        <PlayIcon className="fill-current" />
                      </Button>
                    </>
                  )}
                </div>
                <CardContent className="space-y-4 pt-2">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <h3 className="font-heading text-2xl tracking-tight">
                        {goal.player}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {goal.club} · {goal.competition} · {goal.minute} vs{" "}
                        {goal.opponent}
                      </p>
                    </div>
                    <p className="font-heading text-primary">{goal.scoreline}</p>
                  </div>
                  <p className="leading-relaxed text-foreground/85">
                    {goal.description}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p
                      className="text-sm text-muted-foreground"
                      aria-live="polite"
                    >
                      {count.toLocaleString()} terrace votes
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      variant={hasVoted ? "default" : "outline"}
                      aria-pressed={hasVoted}
                      aria-label={
                        hasVoted
                          ? `Voted for ${goal.player}`
                          : `Cast a vote for ${goal.player}`
                      }
                      disabled={hasVoted || pendingId === goal.id}
                      className={hasVoted ? "disabled:opacity-100" : undefined}
                      onClick={() => castVote(goal)}
                    >
                      {hasVoted && pendingId !== goal.id ? <CheckIcon /> : null}
                      {pendingId === goal.id
                        ? "Casting…"
                        : hasVoted
                          ? "Voted"
                          : "Cast a vote"}
                    </Button>
                  </div>
                  {voteErrorId === goal.id ? (
                    <p className="text-sm text-destructive" role="alert">
                      Could not save your vote for {goal.player}. Try again.
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            </CarouselItem>
          )
        })}
      </CarouselContent>
      <CarouselPrevious className="left-2 border-white/15 bg-black/50 text-foreground" />
      <CarouselNext className="right-2 border-white/15 bg-black/50 text-foreground" />
    </Carousel>
  )
}
