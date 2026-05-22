import { Metadata } from "next"

export const metadata: Metadata = {
  title: "통계 대시보드",
  description: "내 프로필 링크의 방문자 통계와 클릭 수를 확인하세요.",
  openGraph: {
    title: "통계 대시보드 | MyLink",
    description: "내 프로필 링크의 방문자 통계와 클릭 수를 확인하세요.",
  },
  twitter: {
    card: "summary",
    title: "통계 대시보드 | MyLink",
    description: "내 프로필 링크의 방문자 통계와 클릭 수를 확인하세요.",
  }
}

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
