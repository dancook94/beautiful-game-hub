import { Redis } from "@upstash/redis"

import { GOALS_OF_THE_WEEK } from "@/lib/data"
import type { GoalVoteStorage, GoalVotesResponse } from "@/lib/types"

const HASH_KEY = "bgh:goal-of-the-week:votes"

const globalStore = globalThis as typeof globalThis & {
  __bghGoalVotes?: Record<string, number>
}

function seedCounts(): Record<string, number> {
  return Object.fromEntries(
    GOALS_OF_THE_WEEK.map((goal) => [goal.id, goal.votes])
  )
}

function memoryVotes(): Record<string, number> {
  if (!globalStore.__bghGoalVotes) {
    globalStore.__bghGoalVotes = seedCounts()
  }

  for (const goal of GOALS_OF_THE_WEEK) {
    if (typeof globalStore.__bghGoalVotes[goal.id] !== "number") {
      globalStore.__bghGoalVotes[goal.id] = goal.votes
    }
  }

  return globalStore.__bghGoalVotes
}

function copyVotes(votes: Record<string, number>): Record<string, number> {
  const seeded = seedCounts()
  for (const goal of GOALS_OF_THE_WEEK) {
    const count = votes[goal.id]
    if (typeof count === "number" && Number.isFinite(count)) {
      seeded[goal.id] = count
    }
  }
  return seeded
}

/**
 * Upstash Redis when either Vercel KV or Upstash REST credentials are set.
 * `Redis.fromEnv()` only reads the UPSTASH_* pair, so both names are checked here.
 */
function getRedis(): Redis | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN

  if (!url || !token) return null
  return new Redis({ url, token })
}

function countsFromHash(
  raw: Record<string, unknown> | null
): Record<string, number> {
  const votes = seedCounts()
  if (!raw) return votes

  for (const goal of GOALS_OF_THE_WEEK) {
    const value = raw[goal.id]
    const count = typeof value === "number" ? value : Number(value)
    if (Number.isFinite(count)) votes[goal.id] = count
  }

  return votes
}

async function seedRedis(redis: Redis) {
  await Promise.all(
    GOALS_OF_THE_WEEK.map((goal) =>
      redis.hsetnx(HASH_KEY, goal.id, goal.votes)
    )
  )
}

export function isGoalId(goalId: string) {
  return GOALS_OF_THE_WEEK.some((goal) => goal.id === goalId)
}

export async function readGoalVotes(): Promise<GoalVotesResponse> {
  const redis = getRedis()
  if (!redis) {
    return { votes: copyVotes(memoryVotes()), storage: "memory" }
  }

  await seedRedis(redis)
  const raw = await redis.hgetall<Record<string, unknown>>(HASH_KEY)
  return { votes: countsFromHash(raw), storage: "redis" }
}

export async function incrementGoalVote(
  goalId: string
): Promise<GoalVotesResponse | null> {
  if (!isGoalId(goalId)) return null

  const redis = getRedis()
  if (!redis) {
    const votes = memoryVotes()
    votes[goalId] += 1
    return { votes: copyVotes(votes), storage: "memory" satisfies GoalVoteStorage }
  }

  await seedRedis(redis)
  await redis.hincrby(HASH_KEY, goalId, 1)
  const raw = await redis.hgetall<Record<string, unknown>>(HASH_KEY)
  return { votes: countsFromHash(raw), storage: "redis" }
}
