import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { notFound } from "next/navigation"
import { LinkItem } from "@/components/link-item"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export const revalidate = 0 // Disable cache for real-time updates, or use dynamic = 'force-dynamic'

export default async function ProfilePage({ params }: { params: Promise<{ displayName: string }> }) {
  const { displayName } = await params;
  
  // Find user by displayName
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("displayName", "==", displayName));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    notFound();
  }
  
  const userDoc = querySnapshot.docs[0];
  const userData = userDoc.data();
  const userId = userDoc.id;
  
  if (!userData.username) {
     notFound();
  }
  
  // Fetch links
  const linksRef = collection(db, "users", userId, "links");
  const linksQuery = query(linksRef, orderBy("createdAt", "desc"));
  const linksSnapshot = await getDocs(linksQuery);
  
  const links = linksSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      url: data.url,
      clicks: data.clicks || 0,
    };
  });
  
  const initials = userData.username?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || "GU"
  
  return (
    <div className="min-h-screen bg-background transition-colors duration-500 font-sans">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-10 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="flex justify-between items-center max-w-2xl mx-auto w-full p-4">
          <div className="flex gap-2 items-center">
            <Link href="/" className="font-bold tracking-tight text-lg pl-2 hover:opacity-80 transition-opacity">
              MyLink
            </Link>
          </div>
          <div className="flex gap-1 items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>

      <main className="flex flex-col items-center justify-start p-6 pt-24 max-w-2xl mx-auto min-h-screen">
        <header className="flex flex-col items-center text-center gap-6 mb-10 w-full animate-in fade-in slide-in-from-top-4 duration-1000 ease-out">
          <div className="relative">
            {userData.photoURL ? (
              <img src={userData.photoURL} alt="Avatar" className="w-24 h-24 rounded-full object-cover shadow-2xl border-4 border-background ring-1 ring-border/50" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary/90 to-primary/60 flex items-center justify-center text-primary-foreground text-3xl font-bold shadow-2xl border-4 border-background ring-1 ring-border/50">
                {initials}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 w-full">
            <h1 className="text-3xl font-black tracking-tighter text-foreground drop-shadow-sm">
              {userData.username}
            </h1>
            <span className="text-sm font-bold tracking-widest text-muted-foreground/50 uppercase">
              @{userData.displayName}
            </span>
            <p className="text-muted-foreground/80 text-sm font-medium leading-relaxed max-w-[280px] mt-2 mx-auto">
              {userData.bio}
            </p>
          </div>
        </header>

        <nav className="flex flex-col gap-4 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both mb-8">
          {links.length > 0 ? (
            links.map((link) => (
              <LinkItem
                key={link.id}
                link={link}
                userId={userId}
                hideClicks={true}
              />
            ))
          ) : (
            <div className="text-center py-12 flex flex-col items-center border-2 border-dashed border-border rounded-xl animate-in fade-in duration-500 bg-muted/20">
              <div className="text-4xl mb-3">👻</div>
              <p className="text-muted-foreground font-medium mb-1">아직 등록된 링크가 없네요!</p>
            </div>
          )}
        </nav>

        <footer className="mt-auto py-16 text-center animate-in fade-in duration-1000 delay-500">
          <Link href="/" className="text-[10px] font-bold tracking-[0.4em] text-muted-foreground/20 uppercase hover:text-muted-foreground/40 transition-colors">
            Powered by MyLink
          </Link>
        </footer>
      </main>
    </div>
  )
}
