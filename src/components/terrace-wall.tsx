"use client"

import { useMemo, useState } from "react"
import { TERRACE_POSTS } from "@/lib/data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Heart, MessageCircle } from "lucide-react"

export function TerraceWall() {
  const [query, setQuery] = useState("")
  const [liked, setLiked] = useState<Record<string, boolean>>({})

  const posts = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return TERRACE_POSTS
    return TERRACE_POSTS.filter(
      (post) =>
        post.body.toLowerCase().includes(q) ||
        post.club.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-4">
        <p className="text-muted-foreground">
          A fake community wall with real feelings. Filter by club, shout into
          the void, and remember: nobody is selling you a scarf from this page.
        </p>
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search the terrace — Boca, Kop, derby…"
          className="bg-black/30"
        />
        <Card className="bg-[#0d140d] ring-primary/15">
          <CardContent className="space-y-3 pt-6">
            <p className="font-heading text-lg">House rules</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Banter is a high press, not a red card.</li>
              <li>Every league is a home league to someone.</li>
              <li>VAR exists; we do not have to like it.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <ScrollArea className="h-[560px] rounded-xl border border-white/10 bg-[#0d140d]">
        <div className="space-y-3 p-4">
          {posts.map((post) => {
            const initials = post.author
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
            const isLiked = Boolean(liked[post.id])
            return (
              <article
                key={post.id}
                className="rounded-xl border border-white/8 bg-black/25 p-4"
              >
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-heading text-foreground">
                        {post.author}
                      </span>
                      <span className="text-muted-foreground">{post.handle}</span>
                      <span className="text-primary">{post.club}</span>
                      <span className="text-muted-foreground">{post.timeAgo}</span>
                    </div>
                    <p className="mt-2 leading-relaxed text-foreground/90">
                      {post.body}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant={isLiked ? "default" : "ghost"}
                        onClick={() =>
                          setLiked((current) => ({
                            ...current,
                            [post.id]: !current[post.id],
                          }))
                        }
                      >
                        <Heart className="size-3.5" />
                        {post.likes + (isLiked ? 1 : 0)}
                      </Button>
                      <Button size="sm" variant="ghost">
                        <MessageCircle className="size-3.5" />
                        {post.replies}
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
          {posts.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">
              Nobody is singing that one. Try another club.
            </p>
          ) : null}
        </div>
      </ScrollArea>
    </div>
  )
}
