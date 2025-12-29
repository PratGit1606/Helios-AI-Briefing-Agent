export default function GridMockup() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg border-2 border-gray-300 overflow-hidden shadow-sm hover:shadow-md transition">
          <div className="relative w-full bg-gradient-to-br from-gray-700 to-gray-800" style={{ aspectRatio: '4/3' }}>
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 opacity-10">
              {Array.from({ length: 48 }).map((_, idx) => (
                <div key={idx} className="border border-gray-500" />
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white/60">
                <div className="text-4xl mb-2">🖼️</div>
                <div className="text-xs">Image</div>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="h-6 bg-black rounded w-4/5" />
            
            <div className="space-y-2">
              <div className="h-3 bg-gray-300 rounded w-full" />
              <div className="h-3 bg-gray-300 rounded w-5/6" />
              <div className="h-3 bg-gray-300 rounded w-3/4" />
            </div>

            <div className="pt-2">
              <div className="h-9 bg-yellow-400 rounded flex items-center justify-center">
                <span className="text-black font-bold text-xs">Learn More →</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}