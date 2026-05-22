import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner"

import { Providers } from "@/app/providers"

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === "production" ? "https://my-link-three-chi.vercel.app" : "http://localhost:3000"),
  title: {
    template: "%s | MyLink",
    default: "MyLink - 나만의 프로필 링크",
  },
  description: "나만의 프로필 링크를 만들어 모든 채널을 하나의 페이지로 연결하세요. 구글 로그인으로 1초 만에 무료로 시작할 수 있습니다.",
  keywords: ["링크트리", "프로필 링크", "멀티링크", "MyLink", "링크 모음", "바이오 링크", "인스타그램 링크", "크리에이터 링크"],
  openGraph: {
    title: "MyLink - 세상에서 가장 심플한 나만의 프로필 링크",
    description: "내 모든 채널을 하나의 페이지에 담아보세요. 구글 로그인만으로 단 1초 만에 나만의 프로필 링크를 완성할 수 있습니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "MyLink",
    url: "https://my-link-three-chi.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyLink - 세상에서 가장 심플한 나만의 프로필 링크",
    description: "내 모든 채널을 하나의 페이지에 담아보세요. 구글 로그인만으로 단 1초 만에 나만의 프로필 링크를 완성할 수 있습니다.",
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
            <Toaster position="top-center" />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
