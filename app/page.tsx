"use client"

import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Pencil, Loader2, LogOut, LogIn, Eye, Link } from "lucide-react"
import { LinkAddDialog } from "@/components/link-add-dialog"
import { LinkItem } from "@/components/link-item"
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, updateDoc, deleteDoc, getDoc, setDoc } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from "firebase/auth"
import { Button } from "@/components/ui/button"

export default function Page() {
  const [links, setLinks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<{ displayName: string; bio: string; handle: string }>({
    displayName: "Guest",
    bio: "",
    handle: "guest",
  })
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        await fetchProfile(currentUser)
        fetchLinks(false, currentUser.uid)
      } else {
        setLinks([])
        setProfile({ displayName: "", bio: "", handle: "" })
        setIsLoading(false)
      }
    })
    return () => unsubscribe()
  }, [])

  const fetchProfile = async (currentUser: User) => {
    try {
      const userRef = doc(db, "users", currentUser.uid)
      const userSnap = await getDoc(userRef)
      if (userSnap.exists()) {
        const data = userSnap.data()
        setProfile({
          displayName: data.displayName || currentUser.displayName || "Guest",
          bio: data.bio || "소개글을 입력해주세요.",
          handle: data.handle || currentUser.email?.split('@')[0] || "guest"
        })
      } else {
        const newProfile = {
          displayName: currentUser.displayName || "Guest",
          bio: "소개글을 입력해주세요.",
          handle: currentUser.email?.split('@')[0] || "guest",
          createdAt: serverTimestamp()
        }
        await setDoc(userRef, newProfile)
        setProfile(newProfile as any)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const fetchLinks = async (silent = false, uid?: string) => {
    const targetUid = uid || user?.uid
    if (!targetUid) return

    if (!silent) setIsLoading(true)
    try {
      const q = query(collection(db, "users", targetUid, "links"), orderBy("createdAt", "desc"))
      
      const promises: any[] = [getDocs(q)]
      if (!silent) {
        promises.push(new Promise(resolve => setTimeout(resolve, 500)))
      }
      
      const [querySnapshot] = await Promise.all(promises)

      const fetchedLinks = querySnapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      }))
      setLinks(fetchedLinks)
    } catch (error) {
      console.error("Error fetching links:", error)
    } finally {
      if (!silent) setIsLoading(false)
    }
  }

  const handleAddLink = async (newLink: { title: string; url: string }) => {
    if (!user) return
    try {
      const linksRef = collection(db, "users", user.uid, "links")
      await addDoc(linksRef, {
        ...newLink,
        createdAt: serverTimestamp()
      })
      await fetchLinks(true)
    } catch (error) {
      console.error("Error adding link to Firestore:", error)
    }
  }

  const handleUpdateLink = async (id: string, updatedData: { title: string; url: string }) => {
    if (!user) return
    try {
      const linkRef = doc(db, "users", user.uid, "links", id)
      await updateDoc(linkRef, {
        ...updatedData,
        updatedAt: serverTimestamp()
      })
      await fetchLinks(true)
    } catch (error) {
      console.error("Error updating link:", error)
    }
  }

  const handleDeleteLink = async (id: string) => {
    if (!user) return
    try {
      const linkRef = doc(db, "users", user.uid, "links", id)
      await deleteDoc(linkRef)
      await fetchLinks(true)
    } catch (error) {
      console.error("Error deleting link:", error)
    }
  }

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
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

  const initials = profile.displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-background transition-colors duration-500 font-sans">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-10 max-w-md mx-auto w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="flex gap-2 items-center">
          {user ? (
            <>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
                <LogOut className="w-4 h-4 mr-2" />
                로그아웃
              </Button>
            </>
          ) : (
            <span className="font-bold tracking-tight text-lg pl-2">MyLink</span>
          )}
        </div>
        <div className="flex gap-1 items-center">
          {user && (
            <>
              <Button variant="ghost" size="icon" title="실제 화면 보기">
                <Eye className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" title="내 링크 복사">
                <Link className="w-4 h-4 text-muted-foreground" />
              </Button>
            </>
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

      <main className="flex flex-col items-center justify-start p-6 pt-24 max-w-md mx-auto min-h-screen">
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
                  <h1 className="text-3xl font-black tracking-tighter text-foreground drop-shadow-sm cursor-text hover:bg-muted/50 px-3 py-1 rounded-md transition-colors">
                    {profile.displayName}
                    <Pencil className="w-4 h-4 ml-2 inline-block text-muted-foreground/0 group-hover/header:text-muted-foreground/30 hover:!text-primary transition-all cursor-pointer" />
                  </h1>
                </div>
                <div className="flex items-center justify-center gap-2 mt-[-4px] group/handle">
                  <span className="text-sm font-bold tracking-widest text-muted-foreground/50 uppercase">
                    @{profile.handle}
                  </span>
                </div>
                <div className="flex items-start justify-center gap-2 group/bio mt-2 w-full">
                   <p className="text-muted-foreground/80 text-sm font-medium leading-relaxed max-w-[280px] hover:bg-muted/50 px-3 py-2 rounded-md transition-colors cursor-text">
                    {profile.bio}
                    <Pencil className="w-3.5 h-3.5 inline-block ml-2 text-muted-foreground/0 group-hover/bio:text-muted-foreground/30 hover:!text-primary transition-all cursor-pointer shrink-0" />
                  </p>
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


