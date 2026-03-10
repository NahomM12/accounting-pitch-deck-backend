"use client"

import { useEffect, useMemo, useState } from "react"
import { Loader2, Clock, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import type { Appointment, AvailabilitySlot } from "@/lib/types"
import {
  createAvailabilitySlot,
  deleteAvailabilitySlot,
  getAvailability,
  getAppointments,
} from "@/lib/api"
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth,
  isSameDay,
  getDay,
  startOfWeek,
  endOfWeek
} from "date-fns"

const DAYS: { value: AvailabilitySlot["day_of_week"]; label: string }[] = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
]

const INCREMENTS = [15, 30, 60] as const

const DAY_START_MINUTES = 9 * 60
const DAY_END_MINUTES = 17 * 60

function minutesToLabel(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const hh = h.toString().padStart(2, "0")
  const mm = m.toString().padStart(2, "0")
  return `${hh}:${mm}`
}

function timeToMinutes(time: string) {
  const [h, m] = time.slice(0, 5).split(":").map(Number)
  if (Number.isNaN(h) || Number.isNaN(m)) return 0
  return h * 60 + m
}

export default function AdminAppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [range, setRange] = useState<number[]>([
    DAY_START_MINUTES,
    DAY_END_MINUTES,
  ])
  const [increment, setIncrement] = useState<number>(30)
  const [booked, setBooked] = useState<Appointment[]>([])
  const [bookedLoading, setBookedLoading] = useState(true)

  // Get the day of week from selected date
  const selectedDayOfWeek = useMemo(() => {
    const dayMap: { [key: string]: AvailabilitySlot["day_of_week"] } = {
      'Monday': 'monday',
      'Tuesday': 'tuesday',
      'Wednesday': 'wednesday',
      'Thursday': 'thursday',
      'Friday': 'friday',
      'Saturday': 'saturday',
      'Sunday': 'sunday'
    }
    const dayName = format(selectedDate, 'EEEE')
    return dayMap[dayName]
  }, [selectedDate])

  // Get all days to display in the month calendar
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }) // Start from Monday
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })
    
    return eachDayOfInterval({ start: startDate, end: endDate })
  }, [currentMonth])

  // Group days into weeks for easier rendering
  const weeks = useMemo(() => {
    const weeksArray = []
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeksArray.push(calendarDays.slice(i, i + 7))
    }
    return weeksArray
  }, [calendarDays])

  useEffect(() => {
    async function fetchAvailability() {
      try {
        setLoading(true)
        const data = await getAvailability()
        setSlots(data)
      } catch {
        setSlots([])
      } finally {
        setLoading(false)
      }
    }
    fetchAvailability()
  }, [])

  useEffect(() => {
    async function fetchBooked() {
      try {
        setBookedLoading(true)
        const all = await getAppointments()
        const filtered = all.filter((a) => a.status === "booked")
        filtered.sort(
          (a, b) =>
            new Date(a.scheduled_at).getTime() -
            new Date(b.scheduled_at).getTime(),
        )
        setBooked(filtered)
      } catch {
        setBooked([])
      } finally {
        setBookedLoading(false)
      }
    }
    fetchBooked()
  }, [])

  const [startMinutes, endMinutes] = range

  const rangeLabel = useMemo(
    () => `${minutesToLabel(startMinutes)} – ${minutesToLabel(endMinutes)}`,
    [startMinutes, endMinutes],
  )

  const busySegments = useMemo(() => {
    const total = DAY_END_MINUTES - DAY_START_MINUTES
    if (total <= 0) return []
    const daySlots = slots.filter(slot => slot.day_of_week === selectedDayOfWeek)
    return daySlots
      .map((slot) => {
        const start = Math.max(DAY_START_MINUTES, timeToMinutes(slot.start_time))
        const end = Math.min(DAY_END_MINUTES, timeToMinutes(slot.end_time))
        if (end <= start) return null
        const left = ((start - DAY_START_MINUTES) / total) * 100
        const width = ((end - DAY_START_MINUTES) / total) * 100 - left
        return { left, width }
      })
      .filter(Boolean) as { left: number; width: number }[]
  }, [slots, selectedDayOfWeek])

  // Get slots for a specific day of week
  const getSlotsForDayOfWeek = (dayOfWeek: AvailabilitySlot["day_of_week"]) => {
    return slots.filter(slot => slot.day_of_week === dayOfWeek)
  }

  // Count appointments for a specific day
  const getAppointmentsForDay = (date: Date) => {
    return booked.filter(appt => {
      const apptDate = new Date(appt.scheduled_at)
      return isSameDay(apptDate, date)
    })
  }

  async function handleCreateSlot(e: React.FormEvent) {
    e.preventDefault()
    if (endMinutes <= startMinutes) {
      toast.error("End time must be after start time")
      return
    }
    setCreating(true)
    try {
      const payload = {
        day_of_week: selectedDayOfWeek,
        start_time: minutesToLabel(startMinutes),
        end_time: minutesToLabel(endMinutes),
        increment_minutes: increment,
      }
      const slot = await createAvailabilitySlot(payload)
      setSlots((prev) =>
        [...prev, slot].sort((a, b) => a.start_time.localeCompare(b.start_time)),
      )
      toast.success(`Availability added for ${format(selectedDate, 'EEEE, MMMM d')}`)
    } catch (err) {
      const error = err as Error & { data?: unknown }
      toast.error(error.message || "Failed to create slot")
    } finally {
      setCreating(false)
    }
  }

  async function handleDeleteSlot(id: number) {
    try {
      await deleteAvailabilitySlot(id)
      setSlots((prev) => prev.filter((a) => a.id !== id))
      toast.success("Availability removed")
    } catch {
      toast.error("Failed to delete availability")
    }
  }

  // Get weekday labels
  const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-extrabold text-foreground">
            Appointments
          </h1>
          <p className="text-sm text-muted-foreground">
            Define weekly availability so investors can book 1-hour calls.
          </p>
        </div>
      </div>

      {/* Month Calendar View */}
      <div className="mt-6 rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-lg font-bold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMonth(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekdayLabels.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="space-y-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-2">
              {week.map((day) => {
                const dayOfWeek = format(day, 'EEEE').toLowerCase() as AvailabilitySlot["day_of_week"]
                const daySlots = getSlotsForDayOfWeek(dayOfWeek)
                const dayAppointments = getAppointmentsForDay(day)
                const isCurrentMonth = isSameMonth(day, currentMonth)
                const isSelected = isSameDay(day, selectedDate)
                const isToday = isSameDay(day, new Date())
                
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => isCurrentMonth && setSelectedDate(day)}
                    className={`
                      p-3 rounded-lg border transition-all min-h-[100px] text-left
                      ${isSelected 
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                        : 'hover:border-muted-foreground/25'
                      }
                      ${!isCurrentMonth && 'opacity-50 bg-muted/50'}
                      ${isToday && !isSelected && 'border-primary/50 bg-primary/5'}
                    `}
                    disabled={!isCurrentMonth}
                  >
                    <div className="flex items-center justify-between">
                      <p className={`
                        text-sm font-semibold
                        ${isToday ? 'text-primary' : ''}
                      `}>
                        {format(day, 'd')}
                      </p>
                      {dayAppointments.length > 0 && (
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                          {dayAppointments.length} booked
                        </span>
                      )}
                    </div>
                    
                    {isCurrentMonth && daySlots.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-[10px] text-green-600 font-medium">
                          {daySlots.length} slot{daySlots.length !== 1 ? 's' : ''}
                        </p>
                        <div className="space-y-1">
                          {daySlots.slice(0, 2).map((slot) => (
                            <div key={slot.id} className="text-[8px] text-muted-foreground bg-muted px-1 py-0.5 rounded">
                              {slot.start_time.slice(0, 5)}-{slot.end_time.slice(0, 5)}
                            </div>
                          ))}
                          {daySlots.length > 2 && (
                            <div className="text-[8px] text-muted-foreground">
                              +{daySlots.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr,3fr]">
        <div className="rounded-xl border bg-card p-4">
          <h2 className="mb-4 flex items-center gap-2 font-serif text-base font-bold">
            <Clock className="size-4" />
            Add Availability for {format(selectedDate, 'EEEE, MMMM d')}
          </h2>
          <form onSubmit={handleCreateSlot} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Selected Day
              </label>
              <div className="h-9 px-3 py-2 rounded-md border bg-muted text-sm">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Time range</span>
                <span className="font-medium text-foreground">
                  {rangeLabel}
                </span>
              </div>
              <div className="space-y-2">
                <div className="relative h-1.5 w-full rounded-full bg-muted">
                  {busySegments.map((seg, index) => (
                    <div
                      key={index}
                      className="absolute top-0 h-1.5 rounded-full bg-primary/40"
                      style={{
                        left: `${seg.left}%`,
                        width: `${seg.width}%`,
                      }}
                    />
                  ))}
                </div>
                <Slider
                  min={DAY_START_MINUTES}
                  max={DAY_END_MINUTES}
                  step={15}
                  value={range}
                  onValueChange={(values) => {
                    if (Array.isArray(values) && values.length === 2) {
                      setRange(values as number[])
                    }
                  }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Time increment
              </label>
              <Select
                value={String(increment)}
                onValueChange={(v) => setIncrement(Number(v))}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INCREMENTS.map((inc) => (
                    <SelectItem key={inc} value={String(inc)}>
                      Every {inc} minutes
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full font-serif font-semibold"
              disabled={creating}
            >
              {creating ? (
                <>
                  <Loader2 className="mr-1 size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-1 size-4" />
                  Add Slot for {format(selectedDate, 'MMM d')}
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="rounded-xl border bg-card">
          <div className="p-4 border-b">
            <h3 className="font-serif font-semibold">
              Availability for {format(selectedDate, 'EEEE, MMMM d')}
            </h3>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : slots.filter(s => s.day_of_week === selectedDayOfWeek).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Clock className="mb-4 size-10 text-muted-foreground/40" />
              <h3 className="font-serif font-bold text-foreground">
                No availability for this day
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Add a time range using the form.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time range</TableHead>
                    <TableHead>Increment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slots
                    .filter(slot => slot.day_of_week === selectedDayOfWeek)
                    .map((slot) => (
                      <TableRow key={slot.id}>
                        <TableCell className="text-xs text-muted-foreground">
                          {slot.start_time.slice(0, 5)} –{" "}
                          {slot.end_time.slice(0, 5)}
                        </TableCell>
                        <TableCell className="text-xs">
                          Every {slot.increment_minutes} min
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete this availability?
                                  </AlertDialogTitle>
                                </AlertDialogHeader>
                                <p className="text-sm text-muted-foreground">
                                  This will remove the time range from the
                                  schedule. Existing bookings are not affected.
                                </p>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteSlot(slot.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-xl border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-base font-bold text-foreground">
              Booked Hours
            </h2>
            <p className="text-xs text-muted-foreground">
              Upcoming 1-hour slots and the investors who booked them.
            </p>
          </div>
        </div>
        {bookedLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : booked.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No booked appointments yet.
          </p>
        ) : (
          <div className="max-h-80 space-y-3 overflow-y-auto pr-2">
            {booked.map((appt) => {
              const date = new Date(appt.scheduled_at)
              const timeLabel = format(date, 'EEEE, MMMM d, yyyy • h:mm a')
              const investor = appt.investor_user
              return (
                <div
                  key={appt.id}
                  className="flex items-start justify-between rounded-lg border bg-background px-3 py-2 text-xs"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {timeLabel}
                    </p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                      1 hour
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-foreground">
                      {investor?.name || "Unknown investor"}
                    </p>
                    {investor?.email && (
                      <p className="text-[11px] text-muted-foreground">
                        {investor.email}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}