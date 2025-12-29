export default function CardMockup() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg border-2 border-gray-300 overflow-hidden shadow-sm hover:shadow-md transition flex">
          <div className="w-48 flex-shrink-0 bg-gradient-to-br from-gray-700 to-gray-800 relative">
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-10">
              {Array.from({ length: 24 }).map((_, idx) => (
                <div key={idx} className="border border-gray-500" />
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-white/60 text-2xl">
              📰
            </div>
          </div>

          <div className="flex-1 p-4 space-y-2">
            <div className="flex items-center gap-3 text-xs">
              <div className="h-4 w-24 bg-gray-300 rounded" />
              <div className="h-4 w-16 bg-blue-200 rounded" />
            </div>

            <div className="h-5 bg-black rounded w-2/3" />

            <div className="space-y-1">
              <div className="h-3 bg-gray-300 rounded w-full" />
              <div className="h-3 bg-gray-300 rounded w-4/5" />
            </div>

            <div className="pt-1">
              <div className="h-6 w-24 bg-yellow-400 rounded flex items-center justify-center">
                <span className="text-black font-bold text-xs">Read →</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}