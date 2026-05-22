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
  metadataBase: new URL("https://mylink.com"), // TODO: 실제 배포될 도메인으로 변경하세요
  title: {
    template: "%s | MyLink",
    default: "MyLink - 나만의 프로필 링크",
  },
  description: "나만의 프로필 링크를 만들어 모든 채널을 하나의 페이지로 연결하세요. 구글 로그인으로 1초 만에 시작할 수 있습니다.",
  keywords: ["링크트리", "프로필 링크", "멀티링크", "MyLink", "링크 모음", "바이오 링크"],
  openGraph: {
    title: "MyLink - 나만의 프로필 링크",
    description: "모든 채널을 하나의 페이지로 연결하세요. 단 1초 만에 시작하는 나만의 프로필 링크.",
    type: "website",
    locale: "ko_KR",
    siteName: "MyLink",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyLink - 나만의 프로필 링크",
    description: "모든 채널을 하나의 페이지로 연결하세요. 단 1초 만에 시작하는 나만의 프로필 링크.",
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
