"use client"

import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Pencil, Loader2 } from "lucide-react"
import { LinkAddDialog } from "@/components/link-add-dialog"
import { LinkItem } from "@/components/link-item"
import { auth } from "@/lib/firebase"
import Link from "next/link"
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { LogIn } from "lucide-react"
import { useProfile } from "@/hooks/useProfile"
import { useLinks } from "@/hooks/useLinks"
import { Header } from "@/components/header"

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
      if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') return
      console.error("Login failed:", error)
    }
  }

  const initials = profile?.username?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || "GU"

  return (
    <div className="min-h-screen bg-background transition-colors duration-500 font-sans">
      <Header user={user} />

      <main className={`flex flex-col items-center justify-start p-6 pt-24 mx-auto min-h-screen w-full ${!user ? "max-w-6xl" : "max-w-2xl"}`}>
        {!user ? (
          // Logged Out State
          <div className="w-full flex flex-col lg:flex-row items-center justify-center min-h-[70vh] gap-12 lg:gap-24 animate-in fade-in zoom-in duration-700">
            {/* Left/Top Content */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1 gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                마이링크 베타 출시
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
                나만의 <br className="hidden lg:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                  프로필 링크
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-md">
                모든 채널을 하나의 페이지로 연결하세요.<br />
                구글 로그인만으로 단 1초 만에 시작할 수 있습니다.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button onClick={handleLogin} size="lg" className="w-full sm:w-auto h-14 px-8 rounded-full font-bold text-lg shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1">
                  <LogIn className="w-5 h-5 mr-2" />
                  구글 계정으로 시작하기
                </Button>
              </div>
              
              <div className="mt-12 grid grid-cols-3 gap-6 opacity-60">
                <div className="flex flex-col items-center lg:items-start gap-2">
                  <span className="text-2xl font-black">Zero</span>
                  <span className="text-xs font-medium">설정 시간</span>
                </div>
                <div className="flex flex-col items-center lg:items-start gap-2">
                  <span className="text-2xl font-black">∞</span>
                  <span className="text-xs font-medium">무제한 링크</span>
                </div>
                <div className="flex flex-col items-center lg:items-start gap-2">
                  <span className="text-2xl font-black">Free</span>
                  <span className="text-xs font-medium">완전 무료</span>
                </div>
              </div>
            </div>

            {/* Right/Bottom Mockup */}
            <div className="flex-1 w-full max-w-sm relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl rounded-full" />
              <div className="relative bg-background border-4 border-border rounded-[2.5rem] shadow-2xl p-6 overflow-hidden h-[600px] flex flex-col items-center transform lg:rotate-[-2deg] lg:hover:rotate-0 transition-transform duration-500">
                {/* Mobile Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-border rounded-b-xl" />
                
                <div className="mt-12 w-24 h-24 bg-gradient-to-br from-primary/80 to-primary/30 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-4xl">👋</span>
                </div>
                
                <div className="mt-6 w-32 h-5 bg-muted rounded-full" />
                <div className="mt-3 w-40 h-3 bg-muted/50 rounded-full mb-10" />
                
                <div className="w-full flex flex-col gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-full h-16 bg-muted/30 rounded-2xl flex items-center px-4 hover:bg-muted/50 transition-colors cursor-pointer border border-border/50">
                      <div className="w-10 h-10 bg-muted rounded-full mr-4" />
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="w-28 h-3 bg-muted rounded-full" />
                        <div className="w-20 h-2 bg-muted/50 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Logged In State
          <>
            {/* Header Section */}
            <header className="flex flex-col items-center text-center gap-6 mb-12 w-full animate-in fade-in slide-in-from-top-4 duration-1000 ease-out">
              {/* Avatar */}
              <div className="relative group/avatar">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent blur-2xl rounded-full scale-[1.3] -z-10 opacity-70 group-hover/avatar:opacity-100 transition-opacity duration-500" />
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-28 h-28 rounded-full object-cover shadow-2xl shadow-primary/20 border-4 border-background ring-2 ring-primary/10 transition-transform hover:scale-105 duration-300" />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-4xl font-black shadow-2xl shadow-primary/20 border-4 border-background ring-2 ring-primary/10 transition-transform hover:scale-105 duration-300">
                    {initials}
                  </div>
                )}
                <div className="absolute bottom-1 right-1 bg-background rounded-full p-1.5 shadow-lg border border-border/50">
                  <div className="w-3.5 h-3.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex flex-col gap-2 w-full group/header">
                <div className="flex items-center justify-center gap-2">
                  {editingField === "username" ? (
                    <Input
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={handleProfileUpdate}
                      className="text-4xl font-black text-center h-14 w-[320px] rounded-xl shadow-inner bg-muted/30"
                    />
                  ) : (
                    <h1 
                      className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70 drop-shadow-sm cursor-text hover:bg-muted/40 px-4 py-1.5 rounded-2xl transition-all"
                      onClick={() => { setEditingField("username"); setEditValue(profile.username); }}
                    >
                      {profile.username}
                      <Pencil className="w-5 h-5 ml-2 inline-block text-muted-foreground/0 group-hover/header:text-muted-foreground/40 hover:!text-primary transition-all cursor-pointer" />
                    </h1>
                  )}
                </div>
                <div className="flex items-center justify-center gap-2 mt-[-4px]">
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold tracking-widest text-primary/80 bg-primary/10 uppercase px-3 py-1 rounded-full">
                    @{profile.displayName}
                  </span>
                </div>
                <div className="flex items-start justify-center gap-2 group/bio mt-3 w-full">
                  {editingField === "bio" ? (
                    <Input
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={handleProfileUpdate}
                      className="text-base font-medium text-center h-11 w-[320px] rounded-xl shadow-inner bg-muted/30"
                    />
                  ) : (
                    <p 
                      className="text-muted-foreground/90 text-base font-medium leading-relaxed max-w-[320px] hover:bg-muted/40 px-4 py-2.5 rounded-2xl transition-all cursor-text"
                      onClick={() => { setEditingField("bio"); setEditValue(profile.bio); }}
                    >
                      {profile.bio}
                      <Pencil className="w-4 h-4 inline-block ml-2 text-muted-foreground/0 group-hover/bio:text-muted-foreground/40 hover:!text-primary transition-all cursor-pointer shrink-0" />
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
                <div className="text-center py-16 px-6 flex flex-col items-center bg-gradient-to-b from-muted/30 to-transparent border-2 border-dashed border-border/50 rounded-[2rem] animate-in fade-in zoom-in-95 duration-500 shadow-sm">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-inner relative group cursor-default">
                    <span className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20 group-hover:opacity-100 transition-opacity"></span>
                    <span className="text-4xl relative z-10 group-hover:scale-110 transition-transform">👻</span>
                  </div>
                  <p className="text-foreground font-black text-2xl mb-2 tracking-tight">아직 등록된 링크가 없네요!</p>
                  <p className="text-muted-foreground/80 text-base max-w-[280px] leading-relaxed font-medium">위의 버튼을 눌러 첫 번째 링크를 추가하고 나만의 페이지를 채워보세요.</p>
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
