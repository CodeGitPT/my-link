export default function Home() {
  return (
    <div className="w-full min-h-screen bg-[#f0ebd9] font-sans font-bold text-black selection:bg-black selection:text-yellow-400 pb-16">
      
      {/* Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-12 md:pt-24 space-y-16 md:space-y-32">
        
        {/* 1. Hero Section */}
        <header className="flex flex-col items-start gap-8">
          <div className="inline-block border-4 border-black bg-[#ffea57] px-6 py-3 shadow-[6px_6px_0px_#000]">
            <span className="text-xl md:text-3xl font-black uppercase tracking-widest">
              Profile
            </span>
          </div>
          
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[11rem] font-black leading-[0.9] tracking-tighter uppercase break-words w-full">
            KIM DONG <br className="hidden sm:block" /> HYUN
          </h1>
          
          <div className="flex flex-wrap gap-4 mt-4">
             <div className="border-4 border-black bg-white px-8 py-4 shadow-[8px_8px_0px_#000] transform -rotate-1 hover:rotate-0 transition-transform">
                <span className="text-2xl md:text-4xl font-bold uppercase italic">Software Engineer</span>
             </div>
             <div className="border-4 border-black bg-[#57ffd7] px-8 py-4 shadow-[8px_8px_0px_#000] transform rotate-2 hover:rotate-0 transition-transform hidden sm:block">
                <span className="text-2xl md:text-4xl font-bold uppercase mt-1">Web Creator</span>
             </div>
          </div>
        </header>

        {/* 2. Grid Sections (Bento Layout) */}
        {/* 2. Grid Sections (Bento Layout) */}
        <main className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12">
          
          {/* About Me Box : spans 2 cols until xl */}
          <section className="md:col-span-2 border-[6px] border-black bg-white p-6 sm:p-8 xl:p-12 shadow-[12px_12px_0px_#000] hover:-translate-y-2 hover:translate-x-2 hover:shadow-[8px_8px_0px_#000] transition-all">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-8 pb-4 border-b-[6px] border-black uppercase text-black">
              About Me
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed font-bold break-keep">
              아름답고 직관적인 사용자 경험을 단단하게 구축하는 프론트엔드/웹 개발자입니다. 복잡한 문제를 단순하게 풀어나가는 것을 즐기며, 극단적이고 강렬한 디자인 요소(Neobrutalism)를 적용하여 이 웹페이지 자체를 거대한 캔버스처럼 활용합니다.
            </p>
          </section>

          {/* Contact Box : spans 2 cols until xl, 1 col on xl */}
          <section className="md:col-span-2 xl:col-span-1 border-[6px] border-black bg-[#ff5757] text-white p-6 sm:p-8 xl:p-12 shadow-[12px_12px_0px_#000] flex flex-col justify-between hover:-translate-y-2 hover:translate-x-2 hover:shadow-[8px_8px_0px_#000] transition-all">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-8 uppercase text-black">
                Contact
              </h2>
              <div className="flex flex-col sm:flex-row xl:flex-col gap-4 lg:gap-6">
                <a href="#" className="flex-1 border-4 border-black bg-white text-black px-4 py-4 text-center font-black text-xl lg:text-2xl xl:text-3xl hover:bg-black hover:text-white transition-colors cursor-pointer block border-b-8">
                  Email Me
                </a>
                <a href="#" className="flex-1 border-4 border-black bg-white text-black px-4 py-4 text-center font-black text-xl lg:text-2xl xl:text-3xl hover:bg-black hover:text-white transition-colors cursor-pointer block border-b-8">
                  GitHub
                </a>
              </div>
            </div>
            <div className="mt-8 lg:mt-10 xl:mt-12 text-black font-black text-xl md:text-3xl xl:text-2xl uppercase tracking-wider text-center border-t-4 border-black pt-6 break-words">
              Available For Hire
            </div>
          </section>

          {/* Tech Stack Box : spans full width */}
          <section className="md:col-span-2 xl:col-span-3 border-[6px] border-black bg-[#d757ff] p-6 sm:p-8 xl:p-12 shadow-[12px_12px_0px_#000] hover:-translate-y-2 hover:translate-x-2 hover:shadow-[8px_8px_0px_#000] transition-all">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-8 uppercase text-black bg-white inline-block px-6 py-3 border-4 border-black shadow-[6px_6px_0px_#000]">
              Skillset
            </h2>
            <div className="flex flex-wrap gap-4 lg:gap-5 mt-4">
              {['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Figma', 'Node.js', 'PostgreSQL', 'GraphQL'].map((skill, i) => (
                <div key={i} className="border-[4px] border-black bg-[#ffea57] text-black px-5 py-2 font-black text-xl sm:text-2xl md:text-3xl shadow-[6px_6px_0px_#000] hover:bg-white hover:-translate-y-1 transition-all cursor-default">
                  {skill}
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
