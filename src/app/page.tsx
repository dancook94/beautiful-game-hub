import { GoalOfTheWeek } from "@/components/goal-of-the-week"
import { LiveTicker } from "@/components/live-ticker"
import { PredictionGame } from "@/components/prediction-game"
import { SectionHeading } from "@/components/section-heading"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { StadiumHero } from "@/components/stadium-hero"
import { TerraceWall } from "@/components/terrace-wall"
import { WorldPitchMap } from "@/components/world-pitch-map"

export default function Home() {
  return (
    <div id="top" className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <LiveTicker />
      <main className="flex-1">
        <StadiumHero />

        <section className="border-y border-white/5 bg-[#0c120c] px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-7xl space-y-10">
            <SectionHeading
              id="map"
              kicker="The world still fits in ninety minutes"
              title="Drop a pin. Hear a crowd."
              description="From Anfield to the Bombonera, Cairo to Saitama — the same sport, different weather. Scroll the map like a fan with a spare afternoon."
            />
            <WorldPitchMap />
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-7xl space-y-10">
            <SectionHeading
              id="goals"
              kicker="Goal of the week"
              title="The ones you show people who say they don’t like football."
              description="A carousel of mock clips, real feelings, and far too many votes from people who were definitely watching a different match."
            />
            <GoalOfTheWeek />
          </div>
        </section>

        <section className="border-y border-white/5 bg-[#0c120c] px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-7xl space-y-10">
            <SectionHeading
              id="predict"
              kicker="Prediction game"
              title="Fill the slip. Argue later."
              description="Home, draw, or away. Your card stays in this browser. The community bar is a friendly fiction from /api/predictions."
            />
            <PredictionGame />
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-7xl space-y-10">
            <SectionHeading
              id="terrace"
              kicker="Terrace wall"
              title="Everybody has a take. Some of them are even about football."
              description="A mock community feed. Filter it, heart it, and remember the offside law is still a suggestion in the comments."
            />
            <TerraceWall />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
