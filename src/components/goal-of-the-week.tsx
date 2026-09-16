"use client"

import { GOALS_OF_THE_WEEK } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

export function GoalOfTheWeek() {
  return (
    <Carousel opts={{ align: "start", loop: true }} className="w-full">
      <CarouselContent>
        {GOALS_OF_THE_WEEK.map((goal, index) => (
          <CarouselItem key={goal.id} className="md:basis-4/5 lg:basis-3/5">
            <Card className="h-full overflow-hidden bg-[#0d140d] ring-primary/15">
              <div className="relative aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={goal.image}
                  alt={goal.imageAlt}
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0a0f0a] via-[#0a0f0a]/20 to-transparent" />
                <Badge className="absolute top-4 left-4">
                  GOTW #{index + 1}
                </Badge>
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
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    {goal.votes.toLocaleString()} terrace votes
                  </p>
                  <Button size="sm" variant="outline">
                    Cast a vote
                  </Button>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 border-white/15 bg-black/50 text-foreground" />
      <CarouselNext className="right-2 border-white/15 bg-black/50 text-foreground" />
    </Carousel>
  )
}
