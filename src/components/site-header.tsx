import { NAV, SITE } from "@/lib/data"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0f0a]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-primary-foreground">
            BGH
          </span>
          <span className="leading-tight">
            <span className="font-heading block text-sm tracking-tight text-foreground">
              {SITE.name}
            </span>
            <span className="hidden text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase sm:block">
              Fan club of the world
            </span>
          </span>
        </a>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href="#predict"
          className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold tracking-wide text-primary-foreground uppercase sm:px-4 sm:text-sm"
        >
          Play the card
        </a>
      </div>
    </header>
  )
}
