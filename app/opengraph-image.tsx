import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'MyLink - 나만의 프로필 링크'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div tw="flex h-full w-full bg-white flex-row items-center relative overflow-hidden" style={{ fontFamily: 'sans-serif' }}>
        {/* Background decorative shape */}
        <div tw="absolute flex -top-[200px] -right-[100px] w-[800px] h-[800px] bg-indigo-50/50 rounded-full"></div>
        
        <div tw="flex flex-col w-full pl-24 pt-8">
          <div tw="flex flex-col">
            <div tw="flex text-zinc-900 text-[100px] font-black tracking-tighter leading-none mb-6">
              나만의
            </div>
            <div tw="flex text-indigo-600 text-[100px] font-black tracking-tighter leading-none">
              프로필 링크
            </div>
          </div>
          
          <div tw="flex flex-col text-zinc-500 text-[32px] mt-12 font-medium leading-normal max-w-2xl tracking-tight">
            <div tw="flex mb-2">모든 채널을 하나의 페이지로 연결하세요.</div>
            <div tw="flex">구글 로그인만으로 단 1초 만에 시작할 수 있습니다.</div>
          </div>
        </div>
        
        {/* Right Mockup UI */}
        <div tw="absolute flex right-16 top-[15px] w-[360px] h-[600px] border-[12px] border-zinc-100 rounded-[3rem] bg-white shadow-2xl flex-col items-center pt-16 px-6">
           <div tw="flex w-24 h-24 bg-indigo-100 rounded-full items-center justify-center">
             <span tw="flex text-5xl">👋</span>
           </div>
           
           <div tw="flex w-32 h-6 bg-zinc-200 rounded-full mt-10"></div>
           <div tw="flex w-48 h-4 bg-zinc-100 rounded-full mt-4 mb-12"></div>
           
           <div tw="flex w-full flex-col">
             <div tw="flex w-full h-20 bg-zinc-50 rounded-2xl border border-zinc-100 items-center px-4 mb-4">
                <div tw="flex w-12 h-12 bg-zinc-200 rounded-full mr-4"></div>
                <div tw="flex flex-col">
                  <div tw="flex w-24 h-3 bg-zinc-200 rounded-full mb-3"></div>
                  <div tw="flex w-16 h-2 bg-zinc-100 rounded-full"></div>
                </div>
             </div>
             <div tw="flex w-full h-20 bg-zinc-50 rounded-2xl border border-zinc-100 items-center px-4 mb-4">
                <div tw="flex w-12 h-12 bg-zinc-200 rounded-full mr-4"></div>
                <div tw="flex flex-col">
                  <div tw="flex w-32 h-3 bg-zinc-200 rounded-full mb-3"></div>
                  <div tw="flex w-20 h-2 bg-zinc-100 rounded-full"></div>
                </div>
             </div>
             <div tw="flex w-full h-20 bg-zinc-50 rounded-2xl border border-zinc-100 items-center px-4">
                <div tw="flex w-12 h-12 bg-zinc-200 rounded-full mr-4"></div>
                <div tw="flex flex-col">
                  <div tw="flex w-20 h-3 bg-zinc-200 rounded-full mb-3"></div>
                  <div tw="flex w-12 h-2 bg-zinc-100 rounded-full"></div>
                </div>
             </div>
           </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
