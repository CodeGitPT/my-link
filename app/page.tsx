"use client"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { dummyLinks } from "@/data/links"
import { ThemeToggle } from "@/components/theme-toggle"
import { Pencil } from "lucide-react"

export default function Page() {
  const username = "Jane Doe"
  const displayName = "janedoe"
  const bio = "Digital nomad & UI/UX enthusiast. Building minimal things."
  const initials = username.split(' ').map(n => n[0]).join('')

  return (
    <div className="min-h-screen bg-background transition-colors duration-500 font-sans">
      {/* Top Bar for Owner Actions */}
      <div className="fixed top-0 left-0 right-0 p-4 flex justify-end z-10 max-w-md mx-auto">
        <ThemeToggle />
      </div>

      <main className="flex flex-col items-center justify-start p-6 pt-20 max-w-md mx-auto min-h-screen">
        {/* Header Section */}
        <header className="flex flex-col items-center text-center gap-6 mb-10 w-full animate-in fade-in slide-in-from-top-4 duration-1000 ease-out">
          {/* Avatar with Gradient */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary/90 to-primary/60 flex items-center justify-center text-primary-foreground text-3xl font-bold shadow-2xl border-4 border-background ring-1 ring-border/50">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1.5 shadow-md border border-border">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full group/header">
            <div className="flex items-center justify-center gap-2 translate-x-3.5">
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                @{displayName}
              </h1>
              <Pencil className="w-4 h-4 text-muted-foreground/30 group-hover/header:text-muted-foreground/80 cursor-pointer transition-colors" />
            </div>
            <div className="flex items-start justify-center gap-2 group/bio">
               <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-[280px]">
                {bio}
              </p>
              <Pencil className="w-3.5 h-3.5 text-muted-foreground/30 group-hover/bio:text-muted-foreground/80 cursor-pointer transition-colors shrink-0 mt-1" />
            </div>
          </div>
        </header>

        {/* Link List Section */}
        <nav className="flex flex-col gap-4 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
          {dummyLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.985]"
            >
              <Card className="overflow-hidden border-muted-foreground/15 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 bg-card/60 backdrop-blur-md">
                 <CardHeader className="p-4 flex flex-row items-center gap-4 space-y-0">
                  <div className="w-11 h-11 rounded-xl bg-muted/40 flex-shrink-0 flex items-center justify-center overflow-hidden border border-border/60 group-hover:border-primary/20 transition-colors shadow-inner">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=64`}
                      alt=""
                      className="w-6 h-6 object-contain grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500"
                      onError={(e) => {
                         (e.target as HTMLImageElement).src = `https://avatar.vercel.sh/${new URL(link.url).hostname}`;
                      }}
                    />
                  </div>
                  <div className="flex-grow flex items-center justify-between gap-2">
                    <CardTitle className="text-sm font-bold tracking-tight group-hover:text-primary transition-colors">
                      {link.title}
                    </CardTitle>
                    <Pencil className="w-3.5 h-3.5 text-muted-foreground/0 group-hover:text-muted-foreground/50 transition-all" />
                  </div>
                </CardHeader>
              </Card>
            </a>
          ))}
        </nav>

        {/* Footer */}
        <footer className="mt-auto py-16 text-center animate-in fade-in duration-1000 delay-500">
            <span className="text-[10px] font-bold tracking-[0.4em] text-muted-foreground/20 uppercase hover:text-muted-foreground/40 transition-colors cursor-default">
              Powered by MyLink
            </span>
        </footer>
      </main>
    </div>
  )
}


