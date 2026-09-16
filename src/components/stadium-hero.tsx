import { HERO_STATS, SITE } from "@/lib/data"

export function StadiumHero() {
  return (
    <section className="relative isolate min-h-[88vh] overflow-hidden">
      <video
        className="absolute inset-0 size-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.unsplash.com/photo-1522778526097-ce0a22ceb253?auto=format&fit=crop&w=2000&q=80"
      >
        <source
          src="https://videos.pexels.com/video-files/6077718/6077718-hd_1920_1080_25fps.mp4"
          type="video/mp4"
        />
      </video>
      <div className="hero-scrim absolute inset-0" />
      <div className="pitch-lines pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 lg:pb-24">
        <p className="font-heading text-[0.7rem] font-semibold tracking-[0.32em] text-primary uppercase">
          Saturday floodlights · worldwide
        </p>
        <h1 className="font-heading mt-4 max-w-4xl text-5xl leading-[0.95] tracking-tight text-balance text-foreground sm:text-6xl lg:text-8xl">
          The beautiful game,
          <span className="text-primary"> still beautiful.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#f4efe4]/80 sm:text-xl">
          {SITE.tagline} Live scores on the ribbon, a spinning globe of clubs,
          and a terrace that never actually goes home.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#map"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Spin the world
          </a>
          <a
            href="#goals"
            className="rounded-full border border-white/20 bg-black/30 px-5 py-2.5 text-sm font-semibold text-foreground backdrop-blur"
          >
            Goal of the week
          </a>
        </div>
        <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/10 pt-6">
          {HERO_STATS.map((stat) => (
            <div key={stat.label}>
              <dt className="text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
                {stat.label}
              </dt>
              <dd className="font-heading mt-1 text-2xl text-primary sm:text-3xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
