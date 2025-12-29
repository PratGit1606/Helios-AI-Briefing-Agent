'use client';

import React from 'react';
import { Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import type { Brief } from '@/types/brief.types';
import { useRouter } from 'next/navigation';



interface BriefHeaderProps {
  brief: Brief;
  onNavigateHome: () => void;
}

export default function BriefHeader({ brief, onNavigateHome }: BriefHeaderProps) {
  const router = useRouter();
  return (
    <header className="bg-black border-b-4 border-yellow-400 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        <div className="flex items-center gap-6">

          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 text-sm font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Projects
          </button>

          <div>
            <h1 className="text-2xl font-bold text-yellow-400">Helios</h1>
            <p className="text-sm text-gray-300">
              {brief.isApproved ? 'Approved Website Brief' : 'Draft Website Brief'}
            </p>
          </div>

        </div>

        <div className="flex items-center gap-4">
          {brief.isApproved ? (
            <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg font-bold border-2 border-green-300">
              <Lock className="w-4 h-4" />
              Approved – Locked
            </span>
          ) : (
            <span className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-bold border-2 border-yellow-300">
              <AlertCircle className="w-4 h-4" />
              Pending Approval
            </span>
          )}

          <button
            onClick={() => router.push('/dashboard')}
            className="ml-4 bg-[#FFC627] text-black px-6 py-3 rounded-lg font-bold
        hover:bg-yellow-500 transition shadow-lg"
          >
            Access Dashboard
          </button>
        </div>

      </div>
    </header>

  );
}
