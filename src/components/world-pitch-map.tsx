"use client"

import { useMemo, useState } from "react"
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Sphere,
  Graticule,
} from "react-simple-maps"
import { ZoomableGroup } from "react-simple-maps/zoom"
import { MAP_CLUBS } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const GEO_URL = "/maps/world-110m.json"

export function WorldPitchMap() {
  const [activeId, setActiveId] = useState(MAP_CLUBS[0]?.id ?? "")
  const active = useMemo(
    () => MAP_CLUBS.find((club) => club.id === activeId) ?? MAP_CLUBS[0],
    [activeId]
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
      <Card className="overflow-hidden bg-[#0d140d] ring-primary/20">
        <CardHeader className="border-b border-white/5">
          <CardTitle className="font-heading text-lg">
            Football does not have a capital
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Drag the globe. Tap a pin. Eighteen clubs, six continents, one sport.
            Geography from the <code className="text-primary">world-atlas</code>{" "}
            110m countries set, drawn with{" "}
            <code className="text-primary">react-simple-maps</code>.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative bg-[#071107]">
            <ComposableMap
              projection="geoEqualEarth"
              projectionConfig={{ scale: 165, center: [10, 8] }}
              className="h-[460px] w-full sm:h-[540px]"
            >
              <ZoomableGroup>
                <Sphere
                  id="bgh-sphere"
                  fill="#0a140c"
                  stroke="#00A86B"
                  strokeWidth={0.4}
                />
                <Graticule stroke="#00A86B22" step={[15, 15]} />
                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        className="outline-none transition-colors hover:fill-[#1f5a32]"
                        fill="#16351f"
                        stroke="#0a0f0a"
                        strokeWidth={0.4}
                      />
                    ))
                  }
                </Geographies>
                {MAP_CLUBS.map((club) => {
                  const selected = club.id === activeId
                  return (
                    <Marker
                      key={club.id}
                      coordinates={club.coordinates}
                      onClick={() => setActiveId(club.id)}
                    >
                      <g className="cursor-pointer">
                        <circle
                          r={selected ? 7 : 4.5}
                          fill={selected ? "#00A86B" : "#f4efe4"}
                          stroke="#0a0f0a"
                          strokeWidth={1}
                        />
                        {selected ? (
                          <circle
                            r={14}
                            fill="none"
                            stroke="#00A86B"
                            strokeWidth={1}
                            opacity={0.7}
                          />
                        ) : null}
                      </g>
                    </Marker>
                  )
                })}
              </ZoomableGroup>
            </ComposableMap>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <Card className="bg-[#0d140d] ring-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="font-heading">{active.name}</CardTitle>
              <Badge>{active.league}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {active.city}, {active.country} · est. {active.founded}
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-foreground/90">{active.blurb}</p>
            <p className="text-sm text-primary">{active.nickname}</p>
          </CardContent>
        </Card>
        <div className="flex flex-wrap gap-2">
          {MAP_CLUBS.map((club) => (
            <Button
              key={club.id}
              size="sm"
              variant={club.id === activeId ? "default" : "outline"}
              onClick={() => setActiveId(club.id)}
            >
              {club.city}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
