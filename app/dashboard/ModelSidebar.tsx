'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface Props {
  models: readonly string[];
  counts: Record<string, number>;
  active: string;
  onSelect: (model: string) => void;
}

export default function ModelNavbar({
  models,
  counts,
  active,
  onSelect,
}: Props) {
  const router = useRouter();

  return (
    <nav className="bg-black border-b-2 border-[#FFC627] px-6">
      <div className="max-w-7xl mx-auto flex items-center gap-6 h-16">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-sm font-semibold text-[#FFC627]
                     hover:text-yellow-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </button>

        <div className="h-6 w-px bg-gray-700" />

        <div className="flex gap-2 overflow-x-auto">
          {models.map(model => {
            const isActive = active === model;

            return (
              <button
                key={model}
                onClick={() => onSelect(model)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                  transition whitespace-nowrap
                  ${
                    isActive
                      ? 'bg-[#FFC627] text-black'
                      : 'text-gray-300 hover:bg-gray-900'
                  }`}
              >
                <span>{model}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full
                    ${
                      isActive
                        ? 'bg-black/20 text-black'
                        : 'bg-gray-700 text-gray-200'
                    }`}
                >
                  {counts[model]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
