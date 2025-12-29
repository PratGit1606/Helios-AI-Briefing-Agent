'use client';

import React from 'react';
import { Palette } from 'lucide-react';
import LoadingState from '../sections/LoadingState';
import HeroMockup from '../mockups/HeroMockup';
import GridMockup from '../mockups/GridMockup';
import CardMockup from '../mockups/CardMockup';
import FooterMockup from '../mockups/FooterMockup';
import type { Artifact } from '@/types/brief.types';
import type { DesignArtifact } from '@/lib/types';

interface DesignTabProps {
  artifact?: Artifact;
  isGenerating: boolean;
  error: string | null;
}

export default function DesignTab({ artifact, isGenerating, error }: DesignTabProps) {
  if (isGenerating) {
    return <LoadingState message="Generating design inspiration..." />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border-2 border-red-200 shadow-lg p-8">
        <p className="text-red-700">Error: {error}</p>
      </div>
    );
  }

  const content = artifact?.content as unknown as DesignArtifact;

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Palette className="w-6 h-6 text-yellow-400" />
          <h3 className="text-2xl font-bold text-black">Design Inspiration</h3>
        </div>
        <p className="text-sm text-gray-600">
          Visual mockups and design guidance for your website
        </p>
      </div>

      {/* ENHANCEMENT 3: Visual Skeleton Mockups */}
      <div className="space-y-12">
        {/* Hero Section Mockup */}
        <div>
          <h4 className="text-lg font-bold text-black mb-4">Homepage Hero Section</h4>
          <p className="text-sm text-gray-600 mb-4">
            Full-width banner with impactful headline and call-to-action
          </p>
          <HeroMockup />
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <p className="text-sm text-gray-700">
              <strong>Recommendation:</strong> Use high-quality ASU campus imagery, 
              bold headline (max 10 words), 2-3 sentence subtext, and 1-2 prominent CTAs.
            </p>
          </div>
        </div>

        {/* Card Grid Mockup */}
        <div>
          <h4 className="text-lg font-bold text-black mb-4">Feature/Program Grid</h4>
          <p className="text-sm text-gray-600 mb-4">
            3-column responsive grid for showcasing programs, services, or features
          </p>
          <GridMockup />
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <p className="text-sm text-gray-700">
              <strong>Recommendation:</strong> Use consistent card heights, high-quality 
              images, concise titles (3-5 words), and clear CTAs. Grid adapts to 2 columns 
              on tablet, 1 column on mobile.
            </p>
          </div>
        </div>

        {/* Content Card Mockup */}
        <div>
          <h4 className="text-lg font-bold text-black mb-4">Content Cards (News/Events)</h4>
          <p className="text-sm text-gray-600 mb-4">
            Flexible card layout for news articles, blog posts, or event listings
          </p>
          <CardMockup />
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <p className="text-sm text-gray-700">
              <strong>Recommendation:</strong> Include date/timestamp, category tags, 
              image thumbnails, and excerpt text (100-150 characters). Enable hover 
              effects for interactivity.
            </p>
          </div>
        </div>

        {/* Footer Mockup */}
        <div>
          <h4 className="text-lg font-bold text-black mb-4">Footer Navigation</h4>
          <p className="text-sm text-gray-600 mb-4">
            Comprehensive footer with navigation, contact info, and branding
          </p>
          <FooterMockup />
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <p className="text-sm text-gray-700">
              <strong>Recommendation:</strong> Include sitemap links, contact information, 
              social media icons, ASU logo, accessibility statement, and required legal links.
            </p>
          </div>
        </div>
      </div>

      {/* AI-Generated Design Guidance */}
      {content && (
        <div className="mt-12 pt-8 border-t-2 border-gray-200">
          <h4 className="text-lg font-bold text-black mb-6">Additional Design Guidance</h4>
          <div className="space-y-6">
            {content.items.map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                <h5 className="font-bold text-black mb-2">{item.type}</h5>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Style:</strong> {item.style}
                </p>
                <p className="text-sm text-gray-600">{item.reference}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}