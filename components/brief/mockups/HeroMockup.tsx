export default function HeroMockup() {
  return (
    <div className="relative w-full rounded-lg overflow-hidden border-2 border-gray-300 bg-gradient-to-br from-gray-800 to-gray-900" style={{ aspectRatio: '16/7' }}>
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 opacity-10">
        {Array.from({ length: 96 }).map((_, i) => (
          <div key={i} className="border border-gray-600" />
        ))}
      </div>

      <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-16">
        <div className="space-y-3 mb-6 max-w-2xl">
          <div className="h-8 md:h-12 bg-yellow-400/90 rounded w-3/4" />
          <div className="h-8 md:h-12 bg-yellow-400/90 rounded w-2/3" />
        </div>

        <div className="space-y-2 mb-8 max-w-xl">
          <div className="h-4 bg-white/80 rounded w-full" />
          <div className="h-4 bg-white/80 rounded w-5/6" />
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="h-12 w-40 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-sm">Primary CTA</span>
          </div>
          <div className="h-12 w-40 bg-white/10 backdrop-blur border-2 border-white rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Secondary</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-3 py-1 rounded z-30">
        1920x550px recommended
      </div>
    </div>
  );
}