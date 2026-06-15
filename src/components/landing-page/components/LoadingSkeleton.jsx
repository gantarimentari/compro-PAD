import { ContentBorderDashed } from "./ContentBorderDashed";
export  const VideoCarouselSkeleton = () => {
  return (
    <div className="hidden md:flex gap-3 overflow-hidden p-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`
            flex-shrink-0 transition-all duration-500
            w-[calc((100vw-5rem)/3)] max-w-[400px]
            ${i === 2 ? 'scale-125' : 'scale-75'}
          `}
          style={{
            transformOrigin: 'center center',
          }}
        >
          <div className="relative bg-accent-yellow-300/50 rounded-xl shadow-lg overflow-hidden w-full h-[200px]">
            
            <ContentBorderDashed/>
            <div className="relative p-3 z-10 w-full h-full flex items-center justify-center">
              <div className="w-full h-full bg-white/30 rounded-md animate-pulse flex items-center justify-center">
                <svg className="w-16 h-16 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};