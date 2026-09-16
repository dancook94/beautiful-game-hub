import { SITE } from "@/lib/data"

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#070b07]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-heading text-foreground">{SITE.name}</p>
          <p className="text-sm text-muted-foreground">
            A fan site. Mock scores. No merchandise. No checkout.
          </p>
        </div>
        <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
          Pitch green {SITE.pitch} · charcoal {SITE.charcoal}
        </p>
      </div>
    </footer>
  )
}
