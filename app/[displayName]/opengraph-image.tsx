import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ displayName: string }> }) {
  const resolvedParams = await params
  const displayName = resolvedParams.displayName

  return new ImageResponse(
    (
      <div tw="flex h-full w-full flex-col items-center justify-center bg-zinc-950">
        <div tw="flex h-full w-full items-center justify-center flex-col">
          <div tw="flex mb-10 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 px-8 py-3 shadow-xl">
            <span tw="flex text-zinc-400 text-2xl font-bold tracking-widest uppercase">MyLink</span>
          </div>
          
          <div tw="flex text-zinc-50 text-[130px] font-black tracking-tighter mb-8 drop-shadow-2xl">
            {`@${displayName}`}
          </div>
          
          <div tw="flex text-zinc-500 text-4xl font-medium tracking-tight">
            모든 링크를 하나의 페이지로
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
