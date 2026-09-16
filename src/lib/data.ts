import type {
  GoalClip,
  LiveMatch,
  MapClub,
  PredictionFixture,
  TerracePost,
} from "@/lib/types"

export const SITE = {
  name: "The Beautiful Game Hub",
  tagline: "Where the world still gathers for ninety minutes.",
  cream: "#f4efe4",
  pitch: "#00A86B",
  charcoal: "#0a0f0a",
}

export const NAV = [
  { href: "#live", label: "Live" },
  { href: "#map", label: "World" },
  { href: "#goals", label: "Goals" },
  { href: "#predict", label: "Predict" },
  { href: "#terrace", label: "Terrace" },
] as const

const BASE_MATCHES: (Omit<LiveMatch, "minute" | "status" | "home" | "away"> & {
  home: { name: string; short: string; base: number }
  away: { name: string; short: string; base: number }
  startOffsetMin: number
})[] = [
  {
    id: "liv-ars",
    competition: "Premier League",
    competitionShort: "EPL",
    kickoff: "20:00 BST",
    venue: "Anfield",
    startOffsetMin: 67,
    events: ["Salah 23'", "Isak 51'", "Saka 74'"],
    home: { name: "Liverpool", short: "LIV", base: 2 },
    away: { name: "Arsenal", short: "ARS", base: 1 },
  },
  {
    id: "rm-gir",
    competition: "La Liga",
    competitionShort: "LAL",
    kickoff: "21:00 CEST",
    venue: "Santiago Bernabéu",
    startOffsetMin: 34,
    events: ["Mbappé 12'"],
    home: { name: "Real Madrid", short: "RMA", base: 1 },
    away: { name: "Girona", short: "GIR", base: 0 },
  },
  {
    id: "int-nap",
    competition: "Serie A",
    competitionShort: "ITA",
    kickoff: "20:45 CEST",
    venue: "San Siro",
    startOffsetMin: 46,
    events: ["Lautaro 19'", "Lukaku 41'", "Thuram 45+1'"],
    home: { name: "Inter", short: "INT", base: 2 },
    away: { name: "Napoli", short: "NAP", base: 1 },
  },
  {
    id: "bay-bvb",
    competition: "Bundesliga",
    competitionShort: "BUN",
    kickoff: "18:30 CEST",
    venue: "Allianz Arena",
    startOffsetMin: 92,
    events: ["Kane 8'", "Musiala 61'", "Guirassy 77'"],
    home: { name: "Bayern", short: "FCB", base: 2 },
    away: { name: "Dortmund", short: "BVB", base: 1 },
  },
  {
    id: "psg-mar",
    competition: "Ligue 1",
    competitionShort: "FL1",
    kickoff: "20:45 CEST",
    venue: "Parc des Princes",
    startOffsetMin: 12,
    events: [],
    home: { name: "PSG", short: "PSG", base: 0 },
    away: { name: "Marseille", short: "OM", base: 0 },
  },
  {
    id: "bar-atm",
    competition: "La Liga",
    competitionShort: "LAL",
    kickoff: "16:15 CEST",
    venue: "Spotify Camp Nou",
    startOffsetMin: 105,
    events: ["Yamal 6'", "Lewandowski 39'", "Álvarez 88'"],
    home: { name: "Barcelona", short: "FCB", base: 2 },
    away: { name: "Atlético", short: "ATM", base: 1 },
  },
  {
    id: "mia-lafc",
    competition: "MLS",
    competitionShort: "MLS",
    kickoff: "19:30 ET",
    venue: "Chase Stadium",
    startOffsetMin: 55,
    events: ["Messi 14'", "Bouanga 33'"],
    home: { name: "Inter Miami", short: "MIA", base: 1 },
    away: { name: "LAFC", short: "LAFC", base: 1 },
  },
  {
    id: "fla-pal",
    competition: "Brasileirão",
    competitionShort: "BRA",
    kickoff: "16:00 BRT",
    venue: "Maracanã",
    startOffsetMin: 78,
    events: ["Pedro 9'", "Estêvão 62'"],
    home: { name: "Flamengo", short: "FLA", base: 1 },
    away: { name: "Palmeiras", short: "PAL", base: 1 },
  },
]

function hashMinute(seed: string, now: number) {
  const tick = Math.floor(now / 15_000)
  let h = 0
  const s = `${seed}:${tick}`
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

export function buildLiveScores(now = Date.now()): LiveMatch[] {
  return BASE_MATCHES.map((match) => {
    const drift = hashMinute(match.id, now) % 3
    const elapsed = Math.min(94, match.startOffsetMin + drift)
    let status: LiveMatch["status"] = "LIVE"
    let minute: number | null = elapsed
    const extraHome = elapsed > 70 && drift === 2 ? 1 : 0
    const extraAway = elapsed > 80 && drift === 1 ? 1 : 0

    if (elapsed >= 45 && elapsed <= 47 && match.startOffsetMin < 50) {
      status = "HT"
      minute = 45
    }
    if (elapsed >= 90) {
      status = "FT"
      minute = 90
    }
    if (match.startOffsetMin < 0) {
      status = "UPCOMING"
      minute = null
    }

    return {
      id: match.id,
      competition: match.competition,
      competitionShort: match.competitionShort,
      kickoff: match.kickoff,
      venue: match.venue,
      events: match.events,
      minute,
      status,
      home: {
        name: match.home.name,
        short: match.home.short,
        score: match.home.base + extraHome,
      },
      away: {
        name: match.away.name,
        short: match.away.short,
        score: match.away.base + extraAway,
      },
    }
  })
}

export const PREDICTION_FIXTURES: PredictionFixture[] = [
  {
    id: "gw7-mci-che",
    competition: "Premier League · GW7",
    kickoff: "Sat 12:30 BST",
    venue: "Etihad Stadium",
    home: "Manchester City",
    away: "Chelsea",
    community: { home: 58, draw: 22, away: 20 },
  },
  {
    id: "gw7-tot-new",
    competition: "Premier League · GW7",
    kickoff: "Sat 17:30 BST",
    venue: "Tottenham Hotspur Stadium",
    home: "Tottenham",
    away: "Newcastle",
    community: { home: 41, draw: 27, away: 32 },
  },
  {
    id: "ucl-juv-ben",
    competition: "UEFA Champions League",
    kickoff: "Tue 20:00 CEST",
    venue: "Allianz Stadium",
    home: "Juventus",
    away: "Benfica",
    community: { home: 49, draw: 28, away: 23 },
  },
  {
    id: "ucl-spo-aja",
    competition: "UEFA Champions League",
    kickoff: "Wed 21:00 CEST",
    venue: "Estádio da Luz",
    home: "Sporting CP",
    away: "Ajax",
    community: { home: 46, draw: 26, away: 28 },
  },
  {
    id: "liga-sev-rso",
    competition: "La Liga",
    kickoff: "Sun 18:30 CEST",
    venue: "Ramón Sánchez-Pizjuán",
    home: "Sevilla",
    away: "Real Sociedad",
    community: { home: 38, draw: 31, away: 31 },
  },
  {
    id: "bun-rbl-bmg",
    competition: "Bundesliga",
    kickoff: "Sat 15:30 CEST",
    venue: "Red Bull Arena",
    home: "RB Leipzig",
    away: "Gladbach",
    community: { home: 61, draw: 21, away: 18 },
  },
]

export const GOALS_OF_THE_WEEK: GoalClip[] = [
  {
    id: "gotw-yamal",
    player: "Lamine Yamal",
    club: "Barcelona",
    competition: "La Liga",
    minute: "83'",
    scoreline: "Barcelona 3–1 Girona",
    opponent: "Girona",
    votes: 18420,
    description:
      "Cuts in from the right, dummy-steps the full-back, and caresses a far-post curler that kisses the underside of the bar. The Camp Nou does that old inhale-and-erupt thing.",
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Footballer striking a ball in a packed stadium",
  },
  {
    id: "gotw-salah",
    player: "Mohamed Salah",
    club: "Liverpool",
    competition: "Premier League",
    minute: "67'",
    scoreline: "Liverpool 2–1 Brighton",
    opponent: "Brighton",
    votes: 16112,
    description:
      "Receives on the half-turn, shimmies inside, and rifles across the keeper into the postage stamp. Anfield’s Kop end is a single red roar.",
    image:
      "https://images.unsplash.com/photo-1518091043644-c1d4457512c8?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Stadium crowd rising as a goal is scored",
  },
  {
    id: "gotw-viro",
    player: "Victor Osimhen",
    club: "Galatasaray",
    competition: "Süper Lig",
    minute: "12'",
    scoreline: "Galatasaray 2–0 Fenerbahçe",
    opponent: "Fenerbahçe",
    votes: 14903,
    description:
      "A bouncing ball on the edge of the box, a bicycle kick that should be illegal, and the whole of Istanbul leaning the same way. Pure theatre.",
    image:
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Players contesting a high ball in floodlights",
  },
  {
    id: "gotw-bellingham",
    player: "Jude Bellingham",
    club: "Real Madrid",
    competition: "Champions League",
    minute: "90+3'",
    scoreline: "Real Madrid 1–0 Dortmund",
    opponent: "Dortmund",
    votes: 13888,
    description:
      "Late run, late leap, late header. The Bernabéu clock is already begging for mercy when he arrives like a centre-forward who used to be a midfielder.",
    image:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Night match under stadium floodlights",
  },
  {
    id: "gotw-endrick",
    player: "Endrick",
    club: "Real Madrid",
    competition: "La Liga",
    minute: "51'",
    scoreline: "Real Madrid 4–2 Valencia",
    opponent: "Valencia",
    votes: 12104,
    description:
      "First touch kills a diagonal, second touch opens the angle, third is a whipped finish before the defender has decided whether to slide. Generational pace of thought.",
    image:
      "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Classic black and white football on grass",
  },
]

export const TERRACE_POSTS: TerracePost[] = [
  {
    id: "p1",
    author: "Niamh O’Connor",
    handle: "@kop_niamh",
    club: "Liverpool",
    timeAgo: "4m",
    body: "That second goal is why we still go. Rain, late train, £7 pie — all of it paid for in one swing of a left foot.",
    likes: 842,
    replies: 61,
  },
  {
    id: "p2",
    author: "Mateo Ruiz",
    handle: "@berna_mateo",
    club: "Real Madrid",
    timeAgo: "11m",
    body: "Mbappé on the counter is a video game glitch. The full-back is still turning around in 2019.",
    likes: 1204,
    replies: 88,
  },
  {
    id: "p3",
    author: "Amina Diallo",
    handle: "@pitchside_amina",
    club: "Senegal",
    timeAgo: "22m",
    body: "World map night on BGH: dropped a pin on Dakar and the whole feed remembered 2022. This game belongs to more than five leagues.",
    likes: 2301,
    replies: 140,
  },
  {
    id: "p4",
    author: "Theo Papadopoulos",
    handle: "@gate7_theo",
    club: "Olympiacos",
    timeAgo: "36m",
    body: "Prediction game has me 4/5 this week. The one I missed? Trusting a derby. Never trust a derby.",
    likes: 511,
    replies: 39,
  },
  {
    id: "p5",
    author: "Sofia Almeida",
    handle: "@maracana_sofia",
    club: "Flamengo",
    timeAgo: "1h",
    body: "Maracanã on a Sunday is not a stadium, it is a weather system. You don’t watch Flamengo–Palmeiras. You survive it.",
    likes: 1766,
    replies: 92,
  },
  {
    id: "p6",
    author: "Jonas Berg",
    handle: "@nordic_jonas",
    club: "Malmö FF",
    timeAgo: "2h",
    body: "Goal of the week voting is a scam until Osimhen’s overhead is winning. Then it is science.",
    likes: 909,
    replies: 70,
  },
  {
    id: "p7",
    author: "Priya Shah",
    handle: "@claret_priya",
    club: "Aston Villa",
    timeAgo: "3h",
    body: "Unpopular: a 0–0 with six last-ditch tackles is more beautiful than a 5–4 with two howlers. Fight me on the terrace.",
    likes: 644,
    replies: 201,
  },
  {
    id: "p8",
    author: "Diego Fernández",
    handle: "@boca_diego",
    club: "Boca Juniors",
    timeAgo: "5h",
    body: "La Bombonera doesn’t echo. It answers back. If your world map doesn’t include Buenos Aires, it isn’t a world map.",
    likes: 1540,
    replies: 77,
  },
]

export const MAP_CLUBS: MapClub[] = [
  {
    id: "liv",
    name: "Liverpool",
    city: "Liverpool",
    country: "England",
    league: "Premier League",
    nickname: "The Reds",
    founded: 1892,
    coordinates: [-2.9608, 53.4308],
    blurb: "Anfield on a European night is still the sport’s most persuasive argument.",
  },
  {
    id: "rma",
    name: "Real Madrid",
    city: "Madrid",
    country: "Spain",
    league: "La Liga",
    nickname: "Los Blancos",
    founded: 1902,
    coordinates: [-3.6883, 40.453],
    blurb: "The club that treats the Champions League like a family heirloom.",
  },
  {
    id: "bar",
    name: "Barcelona",
    city: "Barcelona",
    country: "Spain",
    league: "La Liga",
    nickname: "Blaugrana",
    founded: 1899,
    coordinates: [2.1228, 41.3809],
    blurb: "Més que un club — and still the academy the whole planet copies.",
  },
  {
    id: "bay",
    name: "Bayern Munich",
    city: "Munich",
    country: "Germany",
    league: "Bundesliga",
    nickname: "Die Roten",
    founded: 1900,
    coordinates: [11.6247, 48.2188],
    blurb: "Domestic gravity. If the ball is in Bavaria, it eventually rolls here.",
  },
  {
    id: "int",
    name: "Inter Milan",
    city: "Milan",
    country: "Italy",
    league: "Serie A",
    nickname: "Nerazzurri",
    founded: 1908,
    coordinates: [9.124, 45.4781],
    blurb: "San Siro steel: compact, loud, and allergic to giving the ball away cheaply.",
  },
  {
    id: "psg",
    name: "Paris Saint-Germain",
    city: "Paris",
    country: "France",
    league: "Ligue 1",
    nickname: "Les Parisiens",
    founded: 1970,
    coordinates: [2.253, 48.8414],
    blurb: "The Parc still smells of ambition. Stars come; the city remains the star.",
  },
  {
    id: "ajax",
    name: "Ajax",
    city: "Amsterdam",
    country: "Netherlands",
    league: "Eredivisie",
    nickname: "De Godenzonen",
    founded: 1900,
    coordinates: [4.9419, 52.3143],
    blurb: "Total Football’s cathedral. Youth is not a department; it is the religion.",
  },
  {
    id: "ben",
    name: "Benfica",
    city: "Lisbon",
    country: "Portugal",
    league: "Primeira Liga",
    nickname: "As Águias",
    founded: 1904,
    coordinates: [-9.1847, 38.7526],
    blurb: "The Eagle watches. Lisbon nights at the Luz still feel like a continent.",
  },
  {
    id: "gal",
    name: "Galatasaray",
    city: "Istanbul",
    country: "Turkey",
    league: "Süper Lig",
    nickname: "Cimbom",
    founded: 1905,
    coordinates: [28.9784, 41.048],
    blurb: "Welcome to hell, except it is heaven if you are wearing yellow and red.",
  },
  {
    id: "boca",
    name: "Boca Juniors",
    city: "Buenos Aires",
    country: "Argentina",
    league: "Liga Profesional",
    nickname: "Xeneizes",
    founded: 1905,
    coordinates: [-58.3647, -34.6356],
    blurb: "La Bombonera tilts. The stands are closer to the pitch than the pitch is to calm.",
  },
  {
    id: "fla",
    name: "Flamengo",
    city: "Rio de Janeiro",
    country: "Brazil",
    league: "Brasileirão",
    nickname: "Mengão",
    founded: 1895,
    coordinates: [-43.2302, -22.9121],
    blurb: "The Maracanã in ruby and black. Carnival with a defensive midfielder.",
  },
  {
    id: "ala",
    name: "Al Ahly",
    city: "Cairo",
    country: "Egypt",
    league: "Egyptian Premier League",
    nickname: "The Red Castle",
    founded: 1907,
    coordinates: [31.2235, 30.069],
    blurb: "Africa’s most decorated club. Cairo turns red and the continent listens.",
  },
  {
    id: "kai",
    name: "Kaizer Chiefs",
    city: "Johannesburg",
    country: "South Africa",
    league: "Premiership",
    nickname: "Amakhosi",
    founded: 1970,
    coordinates: [28.025, -26.234],
    blurb: "Soweto derby air is thick enough to taste. Chiefs still own the noise.",
  },
  {
    id: "lag",
    name: "Remo Stars / Super Eagles trail",
    city: "Lagos",
    country: "Nigeria",
    league: "NPFL / National team",
    nickname: "Eko",
    founded: 1960,
    coordinates: [3.3792, 6.5244],
    blurb: "Lagos football is street, stadium, and satellite all at once.",
  },
  {
    id: "syd",
    name: "Sydney FC",
    city: "Sydney",
    country: "Australia",
    league: "A-League",
    nickname: "The Sky Blues",
    founded: 2004,
    coordinates: [151.063, -33.889],
    blurb: "Harbour city, winter nights, and a league that keeps punching above its timezone.",
  },
  {
    id: "uraw",
    name: "Urawa Red Diamonds",
    city: "Saitama",
    country: "Japan",
    league: "J1 League",
    nickname: "Reds",
    founded: 1950,
    coordinates: [139.717, 35.903],
    blurb: "Asian championship DNA and a support that treats Tuesday like a cup final.",
  },
  {
    id: "sea",
    name: "Seattle Sounders",
    city: "Seattle",
    country: "United States",
    league: "MLS",
    nickname: "Rave Green",
    founded: 2007,
    coordinates: [-122.3316, 47.5952],
    blurb: "Emerald City tifo and a proof that American soccer can feel old-world loud.",
  },
  {
    id: "ame",
    name: "Club América",
    city: "Mexico City",
    country: "Mexico",
    league: "Liga MX",
    nickname: "Las Águilas",
    founded: 1916,
    coordinates: [-99.1506, 19.3029],
    blurb: "Estadio Azteca altitude, clásico venom, and the biggest shirt in the Americas.",
  },
]

export const HERO_STATS = [
  { label: "Competitions tracked", value: "42" },
  { label: "Live pins tonight", value: "18" },
  { label: "Terrace voices", value: "12.4k" },
]
