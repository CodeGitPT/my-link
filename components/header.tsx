"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, Link as LinkIcon, LogOut, LogIn, BarChart3 } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { User, signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { toast } from "sonner"
import { useProfile } from "@/hooks/useProfile"

export function Header({ user }: { user: User | null }) {
  const router = useRouter()
  const { profile } = useProfile(user)

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch (error: any) {
      if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') return
      console.error("Login failed:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handlePreview = () => {
    if (profile?.displayName) window.open(`/${profile.displayName}`, '_blank')
  }

  const handleCopyLink = async () => {
    if (!profile?.displayName) return
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${profile.displayName}`)
      toast.success("마이링크 주소가 복사되었습니다!")
    } catch (err) {
      console.error("Failed to copy:", err)
      toast.error("링크 복사에 실패했습니다.")
    }
  }

  const initials = profile?.username?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || "GU"

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="flex justify-between items-center max-w-2xl mx-auto w-full p-4">
        <div className="flex gap-2 items-center">
          <Link href="/" className="font-bold tracking-tight text-lg pl-2 hover:opacity-80 transition-opacity">MyLink</Link>
        </div>
        <div className="flex gap-1 items-center">
          {user && profile?.displayName && (
            <Link
              href={`/${profile.displayName}`}
              target="_blank"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "hidden sm:flex mr-2 shadow-sm rounded-full font-semibold"
              )}
            >
              <Eye className="w-4 h-4 mr-2" />
              내 페이지
            </Link>
          )}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {initials}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">{profile?.username}</p>
                    <p className="w-[200px] truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handlePreview}>
                  <Eye className="mr-2 h-4 w-4" />
                  <span>내 페이지 미리보기</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={handleCopyLink}>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  <span>내 페이지 링크 복사</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/stats')}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  <span>통계 대시보드</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {!user && (
            <Button variant="outline" size="sm" onClick={handleLogin} className="mr-2">
              <LogIn className="w-4 h-4 mr-2" />
              구글 로그인
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
