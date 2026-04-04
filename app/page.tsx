import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { dummyLinks } from "@/data/links"

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 pt-20 bg-background text-foreground">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="flex flex-col items-center gap-2 mb-4">
          <div className="w-20 h-20 rounded-full bg-muted animate-pulse mb-2" />
          <h1 className="text-xl font-bold tracking-tight">@username</h1>
          <p className="text-sm text-muted-foreground text-center">
            나만의 링크 모음 페이지
          </p>
        </header>

        <nav className="flex flex-col gap-3">
          {dummyLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group transition-all duration-200"
            >
              <Card className="hover:bg-accent hover:text-accent-foreground transition-colors border-muted-foreground/20">
                <CardHeader className="py-4">
                  <CardTitle className="text-center text-sm font-medium">
                    {link.title}
                  </CardTitle>
                </CardHeader>
              </Card>
            </a>
          ))}
        </nav>

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} MyLink. All rights reserved.
        </footer>
      </div>
    </main>
  )
}

