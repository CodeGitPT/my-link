export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 font-sans p-4 sm:p-8">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-[120px]" />
      <div className="absolute top-1/4 left-1/4 -z-10 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-[100px]" />
      
      <main className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl sm:p-12">
        <div className="flex flex-col items-center gap-6 text-center">
          
          {/* Profile Avatar */}
          <div className="relative group">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-75 blur transition duration-500 group-hover:opacity-100 group-hover:duration-200"></div>
            <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-zinc-800 bg-zinc-900 shadow-xl">
              <span className="text-4xl font-black text-white/50 tracking-tighter">DH</span>
            </div>
          </div>

          {/* Name & Title */}
          <div className="space-y-2 text-center">
            <h1 className="bg-gradient-to-r from-zinc-100 to-zinc-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
              김동현
            </h1>
            <p className="text-lg font-medium text-indigo-400">
              Developer & Creator
            </p>
          </div>

          {/* Description */}
          <p className="text-base text-zinc-400 leading-relaxed max-w-sm">
            아름다운 웹 경험을 만드는 것에 열정을 가지고 있습니다. 문제를 해결하고 가치를 만드는 코드를 작성합니다.
          </p>

          {/* Action Links */}
          <div className="mt-4 flex w-full flex-col gap-3 sm:flex-row">
            <a
              href="#"
              className="group relative flex w-full flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 font-semibold text-white transition-all hover:bg-indigo-400 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              이메일 보내기
            </a>
            <a
              href="#"
              className="flex w-full flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-3 font-medium text-zinc-200 transition-all hover:bg-zinc-700 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              GitHub
            </a>
          </div>
        </div>
      </main>

      <footer className="absolute bottom-6 text-sm text-zinc-500">
        © {new Date().getFullYear()} 김동현. All rights reserved.
      </footer>
    </div>
  );
}
