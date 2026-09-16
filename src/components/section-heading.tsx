import { cn } from "cn"

export function SectionHeading({
  kicker,
  title,
  description,
  id,
  className,
}: {
  kicker: string
  title: string
  description?: string
  id?: string
  className?: string
}) {
  return (
    <div id={id} className={cn("mx-auto max-w-3xl text-center", className)}>
      <p className="font-heading text-[0.7rem] font-semibold tracking-[0.28em] text-primary uppercase">
        {kicker}
      </p>
      <h2 className="font-heading mt-3 text-3xl tracking-tight text-balance text-foreground sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  )
}
