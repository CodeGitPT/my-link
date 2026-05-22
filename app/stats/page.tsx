"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useLinks } from "@/hooks/useLinks"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, User } from "firebase/auth"
import { Loader2, ArrowLeft, BarChart3 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Header } from "@/components/header"

export default function StatsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/')
      } else {
        setUser(currentUser)
      }
      setIsAuthLoading(false)
    })
    return () => unsubscribe()
  }, [router])

  const { links, isLoading } = useLinks(user?.uid, 'clicks')

  const chartData = useMemo(() => {
    if (!links) return []
    return links.map(link => ({
      title: link.title,
      clicks: link.clicks || 0
    }))
  }, [links])

  const totalClicks = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.clicks, 0)
  }, [chartData])

  const chartConfig = {
    clicks: {
      label: "조회수",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/5 via-background to-background p-6 font-sans relative overflow-hidden">
      <Header user={user} />

      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto pt-24 relative z-10">
        <div className="flex items-center mb-10 gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <Link href="/" className="p-2.5 bg-background/50 backdrop-blur-md border border-border/50 hover:bg-muted rounded-full transition-all hover:scale-105 hover:shadow-sm">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl shadow-inner border border-primary/20">
              <BarChart3 className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60 drop-shadow-sm">
              통계 대시보드
            </h1>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
          <Card className="bg-card/40 backdrop-blur-xl shadow-xl border-primary/20 hover:border-primary/40 transition-colors duration-500 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] -mr-16 -mt-16" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-muted-foreground">
                총 클릭 수
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-black text-primary tracking-tighter drop-shadow-sm">{totalClicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-2 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                모든 링크의 클릭 수 합산
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card/40 backdrop-blur-xl shadow-lg border-border/50 hover:border-border/80 transition-colors duration-500 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-muted-foreground">
                등록된 링크 수
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-black tracking-tighter">{links.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="col-span-4 bg-card/40 backdrop-blur-xl shadow-2xl border-border/50 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both overflow-hidden">
          <CardHeader className="border-b border-border/40 bg-muted/20 pb-6">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              링크별 클릭 순위
            </CardTitle>
            <CardDescription className="font-medium text-muted-foreground/80 mt-1">
              가장 많은 반응을 이끌어낸 링크를 한눈에 확인하세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 pl-0">
            {chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-clicks)" stopOpacity={1} />
                      <stop offset="95%" stopColor="var(--color-clicks)" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                  <XAxis
                    dataKey="title"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => value.length > 10 ? value.substring(0, 10) + "..." : value}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <ChartTooltip cursor={{ fill: 'hsl(var(--muted)/0.4)' }} content={<ChartTooltipContent />} />
                  <Bar dataKey="clicks" fill="url(#colorClicks)" radius={[6, 6, 0, 0]} animationDuration={1500} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-muted-foreground font-medium border-2 border-dashed border-border rounded-xl">
                데이터가 없습니다.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
