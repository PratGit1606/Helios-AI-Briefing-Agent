export default function FooterMockup() {
  return (
    <div className="bg-black text-white rounded-lg border-2 border-gray-800 p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="h-8 w-32 bg-yellow-400 rounded mb-4" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-600 rounded w-full" />
            <div className="h-3 bg-gray-600 rounded w-4/5" />
          </div>
        </div>

        {[1, 2, 3].map((col) => (
          <div key={col}>
            <div className="h-5 bg-white/90 rounded w-24 mb-3" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((link) => (
                <div key={link} className="h-3 bg-gray-600 rounded w-3/4" />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="h-3 bg-gray-600 rounded w-48" />
        <div className="flex gap-3">
          {[1, 2, 3, 4].map((icon) => (
            <div key={icon} className="h-8 w-8 bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}