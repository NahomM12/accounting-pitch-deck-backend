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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { 
  format, 
  isSameDay,
  parseISO,
  isAfter,
  startOfDay
} from "date-fns"
import { Calendar } from "@/components/ui/calendar"

export default function InvestorAppointmentsPage() {
  const { user } = useAuth()
  const [available, setAvailable] = useState<AppointmentSlot[]>([])
  const [mine, setMine] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingTime, setBookingTime] = useState<string | null>(null)
  const [confirmTime, setConfirmTime] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

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
      } catch (error) {
        console.error('Failed to load appointments:', error)
        toast.error('Failed to load appointment slots. Please try again.')
        setAvailable([])
        setMine([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  // Available dates (unique days that have at least one slot)
  const availableDates = useMemo(() => {
    const dates = new Set<string>()
    available.forEach(slot => {
      const date = parseISO(slot.scheduled_at)
      if (isAfter(date, startOfDay(new Date())) || isSameDay(date, new Date())) {
        dates.add(format(date, 'yyyy-MM-dd'))
      }
    })
    return Array.from(dates).map(d => parseISO(d))
  }, [available])

  // Get slots for the selected date
  const slotsForSelectedDate = useMemo(() => {
    if (!selectedDate) return []
    return available
      .filter(slot => isSameDay(parseISO(slot.scheduled_at), selectedDate))
      .sort((a, b) => parseISO(a.scheduled_at).getTime() - parseISO(b.scheduled_at).getTime())
  }, [available, selectedDate])

  async function handleBook(time: string) {
    if (!user) {
      toast.error("Please log in as an investor to book.")
      return
    }
    setConfirmTime(null)
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
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 pt-32 pb-8">
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
              <div className="flex flex-col md:flex-row gap-8">
                {/* Calendar Side */}
                <div className="flex-1 flex justify-center md:justify-start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border bg-card/50"
                    disabled={(date) => isAfter(startOfDay(new Date()), date)}
                    modifiers={{
                      available: availableDates
                    }}
                    modifiersStyles={{
                      available: { 
                        fontWeight: 'bold', 
                        color: 'hsl(var(--primary))',
                        textDecoration: 'underline',
                        textUnderlineOffset: '4px'
                      }
                    }}
                  />
                </div>

                {/* Slots Side */}
                <div className="flex-1">
                  <h3 className="text-sm font-semibold mb-4 text-foreground">
                    {selectedDate ? format(selectedDate, 'EEEE, MMMM d') : "Select a date"}
                  </h3>
                  
                  {slotsForSelectedDate.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center bg-white/5">
                      <p className="text-xs text-muted-foreground">
                        No time slots available for this date.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {slotsForSelectedDate.map((slot) => {
                        const time = parseISO(slot.scheduled_at)
                        const label = format(time, 'h:mm a')
                        return (
                          <Button
                            key={slot.scheduled_at}
                            variant="outline"
                            className={cn(
                              "font-serif text-xs transition-all hover:bg-primary hover:text-white",
                              bookingTime === slot.scheduled_at && "opacity-50 pointer-events-none"
                            )}
                            onClick={() => setConfirmTime(slot.scheduled_at)}
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
                  )}

                  <div className="mt-6 flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Available Dates Highlighted
                  </div>
                </div>
              </div>
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

      <AlertDialog open={!!confirmTime} onOpenChange={(open) => !open && setConfirmTime(null)}>
        <AlertDialogContent className="border-white/10 dark:bg-[#1A1A1A]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Confirm Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to schedule this appointment?
              {confirmTime && (
                <span className="block mt-2 font-medium text-foreground">
                  {format(parseISO(confirmTime), 'EEEE, MMMM d, yyyy • h:mm a')}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/20 hover:bg-white/10 text-foreground">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => confirmTime && handleBook(confirmTime)}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}