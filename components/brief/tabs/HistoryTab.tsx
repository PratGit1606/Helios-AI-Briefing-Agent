'use client';

import React from 'react';
import { History, Clock, User, Target, BarChart3 } from 'lucide-react';
import LoadingState from '../sections/LoadingState';
import type { Artifact } from '@/types/brief.types';
import type { HistoryArtifact } from '@/lib/types';

interface HistoryTabProps {
  artifact?: Artifact;
  isGenerating: boolean;
  error: string | null;
}

export default function HistoryTab({ artifact, isGenerating, error }: HistoryTabProps) {
  if (isGenerating) {
    return <LoadingState message="Loading change history..." />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border-2 border-red-200 shadow-lg p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <History className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-lg font-bold text-red-700 mb-2">Error Loading History</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!artifact) {
    return (
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <History className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-lg font-bold text-gray-700 mb-2">No History Available</p>
          <p className="text-sm text-gray-500">Change history will appear after brief approval</p>
        </div>
      </div>
    );
  }

  const content = artifact.content as unknown as HistoryArtifact;

  if (!content || !content.events) {
    return (
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <History className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-lg font-bold text-gray-700 mb-2">Invalid History Data</p>
          <p className="text-sm text-gray-500">The history artifact data is malformed</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return formatDate(dateString);
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <History className="w-6 h-6 text-yellow-400" />
          <h3 className="text-2xl font-bold text-black">{content.title}</h3>
        </div>
        <p className="text-sm text-gray-600">
          Complete audit trail of all project activities and changes
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        {/* Events */}
        <div className="space-y-6">
          {content.events.map((event, idx) => (
            <div key={idx} className="relative pl-16">
              {/* Timeline dot */}
              <div className="absolute left-0 w-12 h-12 bg-yellow-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-black" />
              </div>

              {/* Event card */}
              <div className="bg-gray-50 rounded-lg border-2 border-gray-200 p-4 hover:border-yellow-400 transition">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-black text-lg">{event.action}</h4>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-200 whitespace-nowrap ml-4">
                    {getRelativeTime(event.date)}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{event.user}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative pl-16 pt-6">
          <div className="absolute left-0 w-12 h-12 bg-gray-300 rounded-full border-4 border-white flex items-center justify-center">
            <Target className="w-5 h-5 text-black" />
          </div>
          <div className="bg-gray-100 rounded-lg border-2 border-gray-200 p-4">
            <p className="text-sm text-gray-600 italic">Project started</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-8 p-6 bg-[#FFF6DB] border-2 border-[#FFC627] rounded-lg">
        <h4 className="font-bold text-black mb-3 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-black" />
          Activity Summary
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-2xl font-bold text-black">{content.events.length}</p>
            <p className="text-sm text-black/70">Total Events</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-black">
              {new Set(content.events.map(e => e.user)).size}
            </p>
            <p className="text-sm text-black/70">Contributors</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-black">
              {content.events.filter(e => e.action.toLowerCase().includes('approved')).length}
            </p>
            <p className="text-sm text-black/70">Approvals</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-black">
              {content.events.filter(e => e.action.toLowerCase().includes('generated')).length}
            </p>
            <p className="text-sm text-black/70">Generations</p>
          </div>
        </div>
      </div>
    </div>
  );
}