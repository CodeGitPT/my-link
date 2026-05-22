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
      <div tw="flex h-full w-full bg-white flex-row items-center relative overflow-hidden" style={{ fontFamily: 'sans-serif' }}>
        {/* Background decorative shape */}
        <div tw="absolute flex -top-[200px] -right-[100px] w-[800px] h-[800px] bg-indigo-50/50 rounded-full"></div>
        <div tw="absolute flex bottom-[50px] left-[50px] w-[300px] h-[300px] bg-indigo-50/30 rounded-full"></div>
        
        <div tw="flex flex-col w-full pl-24 pt-8">
          <div tw="flex mb-12">
             <div tw="flex items-center justify-center rounded-full bg-indigo-50 border border-indigo-100 px-6 py-2.5 shadow-sm">
               <span tw="flex text-indigo-600 text-lg font-bold tracking-widest uppercase">MyLink Profile</span>
             </div>
          </div>

          <div tw="flex flex-col">
            <div tw="flex text-indigo-600 text-[36px] font-bold tracking-tight mb-4">
              공식 프로필 링크
            </div>
            <div tw="flex text-zinc-800 text-[80px] font-extrabold tracking-tighter leading-tight">
              @{displayName}
            </div>
          </div>
          
          <div tw="flex flex-col text-zinc-500 text-[36px] mt-10 font-medium leading-relaxed tracking-tight">
            <div tw="flex">모든 채널과 링크를 하나의 페이지에서</div>
            <div tw="flex mt-2">쉽고 빠르게 만나보세요.</div>
          </div>
        </div>
        
        {/* Right Mockup UI */}
        <div tw="absolute flex right-16 top-[15px] w-[360px] h-[600px] border-[12px] border-zinc-100 rounded-[3rem] bg-white shadow-2xl flex-col items-center pt-16 px-6">
           <div tw="flex w-24 h-24 bg-indigo-100 rounded-full items-center justify-center shadow-sm">
             <span tw="flex text-5xl">👋</span>
           </div>
           
           <div tw="flex text-zinc-900 text-2xl font-black mt-6 tracking-tight">@{displayName}</div>
           <div tw="flex w-40 h-3 bg-zinc-100 rounded-full mt-4 mb-10"></div>
           
           <div tw="flex w-full flex-col">
             <div tw="flex w-full h-16 bg-zinc-50 rounded-2xl border border-zinc-100 items-center px-4 mb-4 shadow-sm">
                <div tw="flex w-10 h-10 bg-indigo-100 rounded-full mr-4"></div>
                <div tw="flex flex-col">
                  <div tw="flex w-28 h-3 bg-zinc-200 rounded-full mb-2"></div>
                  <div tw="flex w-16 h-2 bg-zinc-100 rounded-full"></div>
                </div>
             </div>
             <div tw="flex w-full h-16 bg-zinc-50 rounded-2xl border border-zinc-100 items-center px-4 mb-4 shadow-sm">
                <div tw="flex w-10 h-10 bg-indigo-100 rounded-full mr-4"></div>
                <div tw="flex flex-col">
                  <div tw="flex w-32 h-3 bg-zinc-200 rounded-full mb-2"></div>
                  <div tw="flex w-20 h-2 bg-zinc-100 rounded-full"></div>
                </div>
             </div>
             <div tw="flex w-full h-16 bg-zinc-50 rounded-2xl border border-zinc-100 items-center px-4 shadow-sm">
                <div tw="flex w-10 h-10 bg-indigo-100 rounded-full mr-4"></div>
                <div tw="flex flex-col">
                  <div tw="flex w-24 h-3 bg-zinc-200 rounded-full mb-2"></div>
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
