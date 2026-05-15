"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  FileText,
  Eye,
  Download,
  Users,
  TrendingUp,
  Loader2,
  Building2,
} from "lucide-react"
import { getAnalytics } from "@/lib/api"
import { toast } from "sonner"

const COLORS = ["#7abce8", "#e9b449", "#5b8ab5", "#22c55e", "#ef4444", "#a855f7"]

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true)
        const res = await getAnalytics()
        setData(res)
      } catch (err) {
        toast.error("Failed to load analytics data")
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!data) return null

  const summaryStats = [
    {
      title: "Total Pitch Decks",
      value: data.summary.total_pitch_decks,
      icon: FileText,
      color: "text-blue-500",
    },
    {
      title: "Total Views",
      value: data.summary.total_views,
      icon: Eye,
      color: "text-amber-500",
    },
    {
      title: "Total Downloads",
      value: data.summary.total_downloads,
      icon: Download,
      color: "text-green-500",
    },
    {
      title: "Total Users",
      value: data.summary.total_users,
      icon: Users,
      color: "text-purple-500",
    },
  ]

  // Format timeline data for Recharts
  const timelineData = data.timeline.views.map((item: any) => {
    const downloadItem = data.timeline.downloads.find((d: any) => d.date === item.date)
    return {
      date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      views: item.count,
      downloads: downloadItem ? downloadItem.count : 0,
    }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-foreground">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Monitor platform performance and user engagement.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`size-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Activity Timeline */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Views and downloads over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                  itemStyle={{ fontSize: "12px" }}
                />
                <Legend />
                <Line type="monotone" dataKey="views" stroke="#e9b449" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="downloads" stroke="#7abce8" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sector Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Sectors</CardTitle>
            <CardDescription>Pitch decks by industry sector</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.sector_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="sector"
                >
                  {data.sector_distribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stage Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Operational Stages</CardTitle>
            <CardDescription>Startups distribution by stage</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.stage_distribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis dataKey="operational_stage" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                   contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                />
                <Bar dataKey="count" fill="#5b8ab5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Viewed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-4 text-amber-500" />
              Top Viewed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.top_viewed.map((deck: any, i: number) => (
                <div key={deck.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-muted-foreground w-4">{i + 1}</span>
                    <span className="text-sm font-medium line-clamp-1">{deck.title}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                    <Eye className="size-3" />
                    {deck.views_count}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Most Downloaded */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="size-4 text-blue-500" />
              Most Downloaded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.top_downloaded.map((deck: any, i: number) => (
                <div key={deck.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-muted-foreground w-4">{i + 1}</span>
                    <span className="text-sm font-medium line-clamp-1">{deck.title}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-blue-600">
                    <Download className="size-3" />
                    {deck.downloads_count}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
