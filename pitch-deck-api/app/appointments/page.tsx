"use client"

import { useEffect, useMemo, useState } from "react"
import { CalendarDays, Loader2, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react"
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
import { 
  format, 
  addWeeks, 
  subWeeks, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isSameDay,
  parseISO,
  isWithinInterval
} from "date-fns"

export default function InvestorAppointmentsPage() {
  const { user } = useAuth()
  const [available, setAvailable] = useState<AppointmentSlot[]>([])
  const [mine, setMine] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingTime, setBookingTime] = useState<string | null>(null)
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))

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

  // Get the days for the current week
  const weekDays = useMemo(() => {
    const start = currentWeekStart
    const end = endOfWeek(currentWeekStart, { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [currentWeekStart])

  // Filter available slots for the current week
  const availableThisWeek = useMemo(() => {
    return available.filter(slot => {
      const slotDate = parseISO(slot.scheduled_at)
      return isWithinInterval(slotDate, {
        start: weekDays[0],
        end: weekDays[6]
      })
    })
  }, [available, weekDays])

  // Group slots by day for the current week
  const groupedByDay = useMemo(() => {
    const map = new Map<string, AppointmentSlot[]>()
    
    // Initialize all days of the week with empty arrays
    weekDays.forEach(day => {
      const key = format(day, 'yyyy-MM-dd')
      map.set(key, [])
    })
    
    // Populate with available slots
    for (const slot of availableThisWeek) {
      const date = parseISO(slot.scheduled_at)
      const key = format(date, 'yyyy-MM-dd')
      if (map.has(key)) {
        map.get(key)!.push(slot)
      }
    }
    
    // Sort slots within each day
    for (const [, slots] of map) {
      slots.sort(
        (a, b) =>
          parseISO(a.scheduled_at).getTime() -
          parseISO(b.scheduled_at).getTime(),
      )
    }
    
    return Array.from(map.entries())
  }, [availableThisWeek, weekDays])

  // Week navigation
  const goToPreviousWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1))
  }

  const goToNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1))
  }

  const goToCurrentWeek = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))
  }

  // Week label
  const weekLabel = useMemo(() => {
    const start = weekDays[0]
    const end = weekDays[6]
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
  }, [weekDays])

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
              {/* Week Slider */}
              <div className="mb-6 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPreviousWeek}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToCurrentWeek}
                    className="text-xs"
                  >
                    Today
                  </Button>
                  <span className="text-sm font-medium">
                    {weekLabel}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNextWeek}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Available Slots by Day */}
              {availableThisWeek.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No open time slots this week. Please check another week or come back later.
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {groupedByDay.map(([day, slots]) => {
                    if (slots.length === 0) return null
                    
                    const date = parseISO(day)
                    const isToday = isSameDay(date, new Date())
                    
                    return (
                      <div key={day} className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <p className={`text-xs font-semibold ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                            {format(date, 'EEEE, MMMM d')}
                            {isToday && <span className="ml-2 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">Today</span>}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {slots.map((slot) => {
                            const time = parseISO(slot.scheduled_at)
                            const label = format(time, 'h:mm a')
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
                    )
                  })}
                </div>
              )}

              {/* Week Navigation Hint */}
              {available.length > 0 && availableThisWeek.length === 0 && (
                <div className="mt-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    No slots available this week. 
                    {available.length > 0 && (
                      <Button
                        variant="link"
                        className="text-xs px-1 h-auto"
                        onClick={goToNextWeek}
                      >
                        Check next week
                      </Button>
                    )}
                  </p>
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
                        {format(parseISO(slot.scheduled_at), 'EEEE, MMMM d, yyyy • h:mm a')} •{" "}
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