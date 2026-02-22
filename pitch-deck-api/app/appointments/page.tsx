"use client"

import { useEffect, useMemo, useState } from "react"
import { CalendarDays, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import type { Appointment, AppointmentSlot } from "@/lib/types"
import { bookAppointmentAt, getAppointmentSlots, getMyAppointments } from "@/lib/api"
import { toast } from "sonner"

export default function InvestorAppointmentsPage() {
  const { user } = useAuth()
  const [available, setAvailable] = useState<AppointmentSlot[]>([])
  const [mine, setMine] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingTime, setBookingTime] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      if (!user) {
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        const [slots, my] = await Promise.all([
          getAppointmentSlots(),
          getMyAppointments(),
        ])
        setAvailable(slots)
        setMine(my)
      } catch {
        setAvailable([])
        setMine([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const grouped = useMemo(() => {
    const map = new Map<string, AppointmentSlot[]>()
    for (const slot of available) {
      const date = new Date(slot.scheduled_at)
      const key = date.toDateString()
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(slot)
    }
    for (const [, slots] of map) {
      slots.sort(
        (a, b) =>
          new Date(a.scheduled_at).getTime() -
          new Date(b.scheduled_at).getTime(),
      )
    }
    return Array.from(map.entries()).sort(
      (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime(),
    )
  }, [available])

  async function handleBook(time: string) {
    if (!user) {
      toast.error("Please log in as an investor to book.")
      return
    }
    setBookingTime(time)
    try {
      const appt = await bookAppointmentAt(time)
      setAvailable((prev) => prev.filter((s) => s.scheduled_at !== time))
      setMine((prev) =>
        [...prev, appt].sort(
          (a, b) =>
            new Date(b.scheduled_at).getTime() -
            new Date(a.scheduled_at).getTime()
        )
      )
      toast.success("Appointment booked successfully")
    } catch (err) {
      const error = err as Error & { data?: { message?: string } }
      toast.error(error.data?.message || error.message || "Failed to book")
    } finally {
      setBookingTime(null)
    }
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 py-8">
      <section className="space-y-2">
        <h1 className="font-serif text-3xl font-extrabold tracking-tight text-foreground">
          Schedule an Appointment
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Choose from available times added by the Ascend team. Once you book a
          slot, it will appear in your upcoming appointments.
        </p>
      </section>

      {!user ? (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-base font-bold">
              Sign in to schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You need an investor account to schedule an appointment. Please
              log in or sign up as an investor first.
            </p>
          </CardContent>
        </Card>
      ) : loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[3fr,2fr]">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-serif text-base font-bold">
                  Available Times
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Pick a slot that works best for you.
                </p>
              </div>
              <CalendarDays className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {available.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No open time slots at the moment. Please check back later.
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {grouped.map(([day, slots]) => (
                    <div key={day} className="rounded-lg border p-3">
                      <p className="text-xs font-semibold text-muted-foreground">
                        {day}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {slots.map((slot) => {
                          const time = new Date(slot.scheduled_at)
                          const label = time.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                          return (
                            <Button
                              key={slot.scheduled_at}
                              variant="outline"
                              size="sm"
                              className="font-serif text-xs"
                              disabled={bookingTime === slot.scheduled_at}
                              onClick={() => handleBook(slot.scheduled_at)}
                            >
                              {bookingTime === slot.scheduled_at ? (
                                <>
                                  <Loader2 className="mr-1 size-3 animate-spin" />
                                  Booking...
                                </>
                              ) : (
                                label
                              )}
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-serif text-base font-bold">
                  Your Appointments
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Upcoming booked calls with the Ascend team.
                </p>
              </div>
              <CheckCircle2 className="size-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              {mine.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  You don&apos;t have any booked appointments yet.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {mine.map((slot) => (
                    <div
                      key={slot.id}
                      className="rounded-lg border p-3 text-xs"
                    >
                      <p className="font-medium text-foreground">
                        {slot.title || "Investor call"}
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        {new Date(slot.scheduled_at).toLocaleString()} •{" "}
                        {slot.duration_minutes} min
                      </p>
                      <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                        Status: <span className="capitalize">{slot.status}</span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
