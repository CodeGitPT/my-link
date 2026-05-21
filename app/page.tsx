"use client"

import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Pencil, Loader2, LogOut, LogIn, Eye, Link as LinkIcon } from "lucide-react"
import { LinkAddDialog } from "@/components/link-add-dialog"
import { LinkItem } from "@/components/link-item"
import { auth } from "@/lib/firebase"
import Link from "next/link"
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from "firebase/auth"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { useProfile } from "@/hooks/useProfile"
import { useLinks } from "@/hooks/useLinks"

export default function Page() {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [editingField, setEditingField] = useState<"username" | "bio" | "displayName" | null>(null)
  const [editValue, setEditValue] = useState("")
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setIsAuthLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const { profile, isLoading: isProfileLoading, updateProfile } = useProfile(user)
  const { links, isLoading: isLinksLoading, addLink, updateLink, deleteLink } = useLinks(user?.uid)

  const isLoading = isAuthLoading || (user && (isProfileLoading || isLinksLoading))

  const handleProfileUpdate = async () => {
    if (!user || !editingField) return
    
    let finalValue = editValue.trim()
    
    if (finalValue === profile[editingField]) {
      setEditingField(null)
      return
    }
    
    if (editingField === "username") {
      if (finalValue.length < 2) {
        toast.error("이름은 최소 2자 이상이어야 합니다.")
        return
      }
    }
    
    try {
      updateProfile({ field: editingField, value: finalValue })
        .then(() => toast.success("프로필이 성공적으로 업데이트되었습니다."))
        .catch((error) => {
          console.error("Error updating profile:", error)
          toast.error("프로필 수정에 실패했습니다.")
        })
        
      setEditingField(null)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("프로필 수정에 실패했습니다.")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleProfileUpdate()
    } else if (e.key === 'Escape') {
      setEditingField(null)
    }
  }

  const handleAddLink = async (newLink: { title: string; url: string }) => {
    if (!user) return
    try {
      await addLink(newLink)
    } catch (error) {
      console.error("Error adding link:", error)
      toast.error("링크 추가에 실패했습니다.")
    }
  }

  const handleUpdateLink = async (id: string, updatedData: { title: string; url: string }) => {
    if (!user) return
    try {
      await updateLink({ id, data: updatedData })
    } catch (error) {
      console.error("Error updating link:", error)
      toast.error("링크 수정에 실패했습니다.")
    }
  }

  const handleDeleteLink = async (id: string) => {
    if (!user) return
    try {
      await deleteLink(id)
    } catch (error) {
      console.error("Error deleting link:", error)
      toast.error("링크 삭제에 실패했습니다.")
    }
  }

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch (error: any) {
      if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
        console.log("로그인 팝업이 닫혔습니다.")
        return
      }
      console.error("Login failed:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handlePreview = () => {
    window.open(`/${profile.displayName}`, '_blank')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${profile.displayName}`)
      toast.success("마이링크 주소가 복사되었습니다!")
    } catch (err) {
      console.error("Failed to copy:", err)
      toast.error("링크 복사에 실패했습니다.")
    }
  }

  const initials = profile?.username?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || "GU"

  return (
    <div className="min-h-screen bg-background transition-colors duration-500 font-sans">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-10 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="flex justify-between items-center max-w-2xl mx-auto w-full p-4">
          <div className="flex gap-2 items-center">
          <Link href="/" className="font-bold tracking-tight text-lg pl-2 hover:opacity-80 transition-opacity">MyLink</Link>
        </div>
        <div className="flex gap-1 items-center">
          {user && (
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
                    <p className="font-medium text-sm">{profile.username}</p>
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

      <main className="flex flex-col items-center justify-start p-6 pt-24 max-w-2xl mx-auto min-h-screen">
        {!user ? (
          // Logged Out State
          <div className="flex flex-col items-center justify-center h-[60vh] text-center gap-6 animate-in fade-in zoom-in duration-700 w-full">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">👋</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">마이링크</h1>
            <p className="text-muted-foreground text-base leading-relaxed max-w-[280px]">
              나만의 프로필 링크를 만들어보세요.<br/>
              구글 로그인 후 바로 사용할 수 있습니다.
            </p>
            <Button onClick={handleLogin} size="lg" className="mt-8 w-full max-w-[280px] rounded-full font-semibold shadow-lg hover:shadow-xl transition-all">
              <LogIn className="w-5 h-5 mr-2" />
              구글로 시작하기
            </Button>
          </div>
        ) : (
          // Logged In State
          <>
            {/* Header Section */}
            <header className="flex flex-col items-center text-center gap-6 mb-10 w-full animate-in fade-in slide-in-from-top-4 duration-1000 ease-out">
              {/* Avatar */}
              <div className="relative">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-24 h-24 rounded-full object-cover shadow-2xl border-4 border-background ring-1 ring-border/50" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary/90 to-primary/60 flex items-center justify-center text-primary-foreground text-3xl font-bold shadow-2xl border-4 border-background ring-1 ring-border/50">
                    {initials}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1.5 shadow-md border border-border">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex flex-col gap-1 w-full group/header">
                <div className="flex items-center justify-center gap-2">
                  {editingField === "username" ? (
                    <Input
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={handleProfileUpdate}
                      className="text-3xl font-black text-center h-12 w-[280px]"
                    />
                  ) : (
                    <h1 
                      className="text-3xl font-black tracking-tighter text-foreground drop-shadow-sm cursor-text hover:bg-muted/50 px-3 py-1 rounded-md transition-colors"
                      onClick={() => { setEditingField("username"); setEditValue(profile.username); }}
                    >
                      {profile.username}
                      <Pencil className="w-4 h-4 ml-2 inline-block text-muted-foreground/0 group-hover/header:text-muted-foreground/30 hover:!text-primary transition-all cursor-pointer" />
                    </h1>
                  )}
                </div>
                <div className="flex items-center justify-center gap-2 mt-[-4px]">
                  <span className="text-sm font-bold tracking-widest text-muted-foreground/50 uppercase px-2 py-0.5">
                    @{profile.displayName}
                  </span>
                </div>
                <div className="flex items-start justify-center gap-2 group/bio mt-2 w-full">
                  {editingField === "bio" ? (
                    <Input
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={handleProfileUpdate}
                      className="text-sm font-medium text-center h-9 w-[280px]"
                    />
                  ) : (
                    <p 
                      className="text-muted-foreground/80 text-sm font-medium leading-relaxed max-w-[280px] hover:bg-muted/50 px-3 py-2 rounded-md transition-colors cursor-text"
                      onClick={() => { setEditingField("bio"); setEditValue(profile.bio); }}
                    >
                      {profile.bio}
                      <Pencil className="w-3.5 h-3.5 inline-block ml-2 text-muted-foreground/0 group-hover/bio:text-muted-foreground/30 hover:!text-primary transition-all cursor-pointer shrink-0" />
                    </p>
                  )}
                </div>
              </div>
            </header>

            {/* Link List Section */}
            <nav className="flex flex-col gap-4 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both mb-8">
              <div className="mb-4 animate-in fade-in slide-in-from-top-4 duration-1000 delay-300 fill-mode-both">
                <LinkAddDialog onAdd={handleAddLink} />
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-8 w-full animate-in fade-in duration-500">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground/50" />
                </div>
              ) : links.length > 0 ? (
                links.map((link) => (
                  <LinkItem
                    key={link.id}
                    link={link}
                    userId={user?.uid}
                    onUpdate={handleUpdateLink}
                    onDelete={handleDeleteLink}
                  />
                ))
              ) : (
                <div className="text-center py-12 flex flex-col items-center border-2 border-dashed border-border rounded-xl animate-in fade-in duration-500 bg-muted/20">
                  <div className="text-4xl mb-3">👻</div>
                  <p className="text-muted-foreground font-medium mb-1">아직 등록된 링크가 없네요!</p>
                  <p className="text-muted-foreground/60 text-sm">위의 버튼을 눌러 첫 번째 링크를 추가해보세요.</p>
                </div>
              )}
            </nav>
          </>
        )}

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
