"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { dummyLinks } from "@/data/links"
import { ThemeToggle } from "@/components/theme-toggle"
import { Pencil, Loader2 } from "lucide-react"
import { LinkAddDialog } from "@/components/link-add-dialog"
import { LinkItem } from "@/components/link-item"
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function Page() {
  const [links, setLinks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const username = "Kim Donghyun"
  const displayName = "kimdonghyun"
  const bio = "Digital nomad & UI/UX enthusiast. Building minimal things."
  const initials = username.split(' ').map(n => n[0]).join('')

  const fetchLinks = async (silent = false) => {
    if (!silent) setIsLoading(true)
    try {
      const q = query(collection(db, "users", "anonymous", "links"), orderBy("createdAt", "desc"))
      
      // 로컬이나 네트워크가 너무 빠르면 로딩 스피너가 깜빡이거나 안 보이는 현상을 방지하기 위해
      // 초기 로딩 시에만 최소 500ms 동안 스피너를 유지합니다.
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

  useEffect(() => {
    fetchLinks()
  }, [])

  const handleAddLink = async (newLink: { title: string; url: string }) => {
    try {
      const linksRef = collection(db, "users", "anonymous", "links")
      await addDoc(linksRef, {
        ...newLink,
        createdAt: serverTimestamp()
      })
      await fetchLinks(true) // 링크 추가 후 목록 조용히 수동 갱신
    } catch (error) {
      console.error("Error adding link to Firestore:", error)
    }
  }

  const handleUpdateLink = async (id: string, updatedData: { title: string; url: string }) => {
    try {
      const linkRef = doc(db, "users", "anonymous", "links", id)
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
    try {
      const linkRef = doc(db, "users", "anonymous", "links", id)
      await deleteDoc(linkRef)
      await fetchLinks(true)
    } catch (error) {
      console.error("Error deleting link:", error)
    }
  }

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

          <div className="flex flex-col gap-1 w-full group/header">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-4xl font-black tracking-tighter text-foreground drop-shadow-sm">
                {username}
              </h1>
            </div>
            <div className="flex items-center justify-center gap-2 mt-[-4px] group/handle">
              <span className="text-sm font-bold tracking-widest text-muted-foreground/50 uppercase">
                @{displayName}
              </span>
              <Pencil className="w-3.5 h-3.5 text-muted-foreground/0 group-hover/handle:text-muted-foreground/30 hover:!text-primary transition-all cursor-pointer" />
            </div>
            <div className="flex items-start justify-center gap-2 group/bio mt-2">
               <p className="text-muted-foreground/80 text-sm font-medium leading-relaxed max-w-[280px]">
                {bio}
              </p>
              <Pencil className="w-3.5 h-3.5 text-muted-foreground/0 group-hover/bio:text-muted-foreground/30 hover:!text-primary transition-all cursor-pointer shrink-0 mt-1" />
            </div>
          </div>
        </header>

        {/* Link List Section */}
        <nav className="flex flex-col gap-4 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both mb-8">
          {/* Add Link Dialog - Moved to Top */}
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
            <div className="text-center py-8 text-muted-foreground/50 text-sm animate-in fade-in duration-500">
              등록된 링크가 없습니다.
            </div>
          )}
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


