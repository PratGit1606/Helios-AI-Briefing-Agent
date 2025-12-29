'use client';

import React from 'react';
import { Search, TrendingUp, Target, Lightbulb } from 'lucide-react';
import LoadingState from '../sections/LoadingState';
import type { Artifact } from '@/types/brief.types';
import type { SEOArtifact } from '@/lib/types';

interface SEOTabProps {
  artifact?: Artifact;
  isGenerating: boolean;
  error: string | null;
}

export default function SEOTab({ artifact, isGenerating, error }: SEOTabProps) {
  if (isGenerating) {
    return <LoadingState message="Generating SEO research..." />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border-2 border-red-200 shadow-lg p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Search className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-lg font-bold text-red-700 mb-2">Error Generating SEO Research</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!artifact) {
    return (
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Search className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-lg font-bold text-gray-700 mb-2">No SEO Data Available</p>
          <p className="text-sm text-gray-500">SEO research will be generated after brief approval</p>
        </div>
      </div>
    );
  }

  const content = artifact.content as unknown as SEOArtifact;

  if (!content || !content.keywords || !content.metadata) {
    return (
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Search className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-lg font-bold text-gray-700 mb-2">Invalid SEO Data</p>
          <p className="text-sm text-gray-500">The SEO artifact data is malformed</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Search className="w-6 h-6 text-yellow-400" />
          <h3 className="text-2xl font-bold text-black">{content.title}</h3>
        </div>
        <p className="text-sm text-gray-600">
          Keyword research and SEO strategy recommendations
        </p>
      </div>

      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Target className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-black mb-2 text-lg">SEO Strategy</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{content.metadata}</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-yellow-400" />
          <h4 className="font-bold text-black text-lg">Target Keywords</h4>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Focus on these keyword opportunities for maximum visibility and organic traffic.
        </p>

        <div className="space-y-3">
          {content.keywords.map((keyword, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-yellow-400 transition group"
            >
              <div className="flex-1">
                <p className="font-bold text-black text-lg mb-1">{keyword.term}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600">
                    <span className="font-semibold">Volume:</span> {keyword.volume}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">
                    <span className="font-semibold">Competition:</span> {keyword.difficulty}
                  </span>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-lg text-sm font-bold ml-4 ${keyword.difficulty === 'Low' ? 'bg-green-100 text-green-800 border-2 border-green-300' :
                  keyword.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300' :
                    'bg-red-100 text-red-800 border-2 border-red-300'
                }`}>
                {keyword.difficulty}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
        <h4 className="flex items-center gap-2 font-bold text-black mb-3">
          <Lightbulb className="w-5 h-5 text-black" />
          SEO Best Practices
        </h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 font-bold mt-0.5">→</span>
            <span>Use target keywords naturally in page titles, headings, and body content</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 font-bold mt-0.5">→</span>
            <span>Create unique meta descriptions (150-160 characters) for each page</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 font-bold mt-0.5">→</span>
            <span>Optimize images with descriptive alt text and compressed file sizes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 font-bold mt-0.5">→</span>
            <span>Ensure mobile-first design and fast page load times (under 3 seconds)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 font-bold mt-0.5">→</span>
            <span>Build internal links between related pages to improve site structure</span>
          </li>
        </ul>
      </div>
    </div>
  );
}