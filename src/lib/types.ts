export type MatchStatus = "LIVE" | "HT" | "FT" | "UPCOMING"

export type LiveMatch = {
  id: string
  competition: string
  competitionShort: string
  kickoff: string
  minute: number | null
  status: MatchStatus
  venue: string
  home: {
    name: string
    short: string
    score: number
  }
  away: {
    name: string
    short: string
    score: number
  }
  events: string[]
}

export type LiveScoresResponse = {
  generatedAt: string
  matches: LiveMatch[]
}

export type PredictionPick = "home" | "draw" | "away"

export type PredictionFixture = {
  id: string
  competition: string
  kickoff: string
  venue: string
  home: string
  away: string
  community: {
    home: number
    draw: number
    away: number
  }
}

export type PredictionsResponse = {
  week: string
  fixtures: PredictionFixture[]
  submitted: number
}

export type PredictionVote = {
  fixtureId: string
  pick: PredictionPick
}

export type GoalClip = {
  id: string
  player: string
  club: string
  competition: string
  minute: string
  scoreline: string
  opponent: string
  description: string
  votes: number
  image: string
  imageAlt: string
}

export type TerracePost = {
  id: string
  author: string
  handle: string
  club: string
  timeAgo: string
  body: string
  likes: number
  replies: number
}

export type MapClub = {
  id: string
  name: string
  city: string
  country: string
  league: string
  nickname: string
  founded: number
  coordinates: [number, number]
  blurb: string
}
