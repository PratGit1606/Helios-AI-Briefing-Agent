import React from 'react';
import { Book, ExternalLink } from 'lucide-react';
import LoadingState from '../sections/LoadingState';
import { DRUPAL_WEBKITS } from '@/lib/constants/drupalWebkits';
import type { Artifact } from '@/types/brief.types';
import type { ContentArtifact } from '@/lib/types';

interface ContentTabProps {
  artifact?: Artifact;
  isGenerating: boolean;
  error: string | null;
  briefSitemap: string[];
}

export default function ContentTab({ artifact, isGenerating, error }: ContentTabProps) {
  if (isGenerating) {
    return <LoadingState message="Generating content planning..." />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border-2 border-red-200 shadow-lg p-8">
        <p className="text-red-700">Error: {error}</p>
      </div>
    );
  }

  const content = artifact?.content as unknown as ContentArtifact;

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-black mb-2">Content & Page Planning</h3>
        <p className="text-sm text-gray-600">
          Recommended Drupal webkits and components for each page
        </p>
      </div>

      {/* AI-Generated Content */}
      {content && (
        <div className="mb-8 pb-8 border-b-2 border-gray-200">
          <h4 className="text-lg font-bold text-black mb-4">Component Recommendations</h4>
          <div className="space-y-6">
            {content.items.map((item, idx) => (
              <div key={idx} className="border-l-4 border-yellow-400 pl-4">
                <h5 className="font-bold text-black mb-1">{item.page}</h5>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Component:</span> {item.component}
                </p>
                <p className="text-sm text-gray-700">{item.rationale}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Book className="w-5 h-5 text-yellow-400" />
          <h4 className="text-lg font-bold text-black">ASU Drupal Webkit Catalog</h4>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Explore all available Drupal webkits for your ASU website. Click documentation links for implementation details.
        </p>

        <div className="mb-6">
          <h5 className="font-bold text-black mb-3 text-sm uppercase tracking-wide">Layout Webkits</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DRUPAL_WEBKITS.filter(w => w.category === 'Layout').map((webkit) => (
              <div key={webkit.id} className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <h6 className="font-bold text-black">{webkit.name}</h6>
                  <a
                    href={webkit.documentation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                    title="View documentation"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-xs text-gray-700 mb-2">{webkit.description}</p>
                <div className="flex flex-wrap gap-1">
                  {webkit.useCases.map((useCase, idx) => (
                    <span key={idx} className="text-xs text-black bg-white px-2 py-1 rounded border border-gray-200">
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h5 className="font-bold text-black mb-3 text-sm uppercase tracking-wide">Content Webkits</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DRUPAL_WEBKITS.filter(w => w.category === 'Content').map((webkit) => (
              <div key={webkit.id} className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <h6 className="font-bold text-black">{webkit.name}</h6>
                  <a
                    href={webkit.documentation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-xs text-gray-700 mb-2">{webkit.description}</p>
                <div className="flex flex-wrap gap-1">
                  {webkit.useCases.map((useCase, idx) => (
                    <span key={idx} className="text-xs text-black bg-white px-2 py-1 rounded border border-gray-200">
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h5 className="font-bold text-black mb-3 text-sm uppercase tracking-wide">Media & Interactive</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DRUPAL_WEBKITS.filter(w => w.category === 'Media' || w.category === 'Interactive').map((webkit) => (
              <div key={webkit.id} className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <h6 className="font-bold text-black">{webkit.name}</h6>
                  <a
                    href={webkit.documentation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-xs text-gray-700 mb-2">{webkit.description}</p>
                <div className="flex flex-wrap gap-1">
                  {webkit.useCases.map((useCase, idx) => (
                    <span key={idx} className="text-xs text-black bg-white px-2 py-1 rounded border border-gray-200">
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}