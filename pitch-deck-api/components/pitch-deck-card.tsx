import Link from "next/link"
import { FileText, MapPin, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getApiOrigin } from "@/lib/api"
import type { PitchDeck } from "@/lib/types"

export function PitchDeckCard({ deck }: { deck: PitchDeck }) {
  const thumbnailUrl = deck.thumbnail_path
    ? `${getApiOrigin()}/storage/${deck.thumbnail_path}`
    : null

  return (
    <Link href={`/pitch-decks/${deck.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/30">
        <div className="aspect-video w-full overflow-hidden bg-muted">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={`${deck.title} thumbnail`}
              className="size-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <FileText className="size-12 text-muted-foreground/40" />
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-base font-bold leading-snug text-card-foreground line-clamp-2">
              {deck.title}
            </h3>
            <Badge variant="secondary" className="shrink-0 text-xs uppercase">
              {deck.file_type}
            </Badge>
          </div>
          {deck.founder && (
            <div className="mt-3 flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">
                {deck.founder.company_name}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {deck.founder.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    <span className="capitalize">{deck.founder.location}</span>
                  </span>
                )}
                {deck.founder.sector && (
                  <span className="flex items-center gap-1">
                    <span className="capitalize">{deck.founder.sector}</span>
                  </span>
                )}
              </div>
            </div>
          )}
          <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="size-3" />
            {new Date(deck.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
