'use client';

import { useState } from 'react';
import { ExternalLink, AlertCircle } from 'lucide-react';
import BriefSection from '../sections/BriefSection';
import { DESIGN_REFERENCES } from '@/lib/constants/designReferences';
import type { Brief } from '@/types/brief.types';
import ChangeRequestModal from '../ChangeRequestModal';
import ChangeRequestList from '../ChangeRequestList';
import { getChangeRequests } from '@/app/actions/changeRequests';

interface BriefTabProps {
  brief: Brief;
  projectId: string;
  onApprove: () => void;
  isApproving: boolean;
  changeRequests?: Array<{
    id: string;
    requester: string;
    sections: string[];
    feedback: string;
    status: string;
    priority: string;
    createdAt: Date;
    reviewedAt: Date | null;
    reviewedBy: string | null;
    resolution: string | null;
  }>;
}

export default function BriefTab({ brief, projectId, onApprove, isApproving, changeRequests = [] }: BriefTabProps) {
  const [showChangeRequestModal, setShowChangeRequestModal] = useState(false);

  const availableSections = [
    'Purpose',
    'Primary Audience',
    'Secondary Audience',
    'Tone & Voice',
    'Sitemap Summary',
    'Constraints',
    'Assumptions',
    'Open Questions'
  ];
  return (
    <div>
      <div className={`bg-white rounded-lg border-2 border-gray-200 shadow-lg p-8 ${brief.isApproved ? 'opacity-90' : ''}`}>


        <BriefSection
          title="Purpose"
          locked={brief.isApproved}
          projectId={projectId}
          enableComments={true}
        >
          <p className="text-gray-700 leading-relaxed">{brief.purpose}</p>
        </BriefSection>

        <BriefSection
          title="Primary Audience"
          locked={brief.isApproved}
          projectId={projectId}
          enableComments={true}
        >
          <p className="text-gray-700 leading-relaxed">{brief.primaryAudience}</p>
        </BriefSection>

        <BriefSection
          title="Secondary Audience"
          locked={brief.isApproved}
          projectId={projectId}
          enableComments={true}
        >
          <p className="text-gray-700 leading-relaxed">{brief.secondaryAudience}</p>
        </BriefSection>

        <BriefSection
          title="Tone & Voice"
          locked={brief.isApproved}
          projectId={projectId}
          enableComments={true}
        >
          <p className="text-gray-700 leading-relaxed">{brief.tone}</p>
        </BriefSection>

        <BriefSection
          title="Sitemap Summary"
          locked={brief.isApproved}
          projectId={projectId}
          enableComments={true}
        >
          <ul className="space-y-2">
            {brief.sitemap.map((page, idx) => (
              <li key={idx} className="flex items-center gap-2 text-gray-700">
                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                {page}
              </li>
            ))}
          </ul>
        </BriefSection>

        <BriefSection
          title="Constraints"
          locked={brief.isApproved}
          projectId={projectId}
          enableComments={true}
        >
          <ul className="space-y-2">
            {brief.constraints.map((constraint, idx) => (
              <li key={idx} className="flex items-center gap-2 text-gray-700">
                <span className="w-4 h-4 text-green-600 flex-shrink-0">✓</span>
                {constraint}
              </li>
            ))}
          </ul>
        </BriefSection>

        <BriefSection
          title="Assumptions"
          locked={brief.isApproved}
          projectId={projectId}
          enableComments={true}
        >
          <div className="space-y-3">
            {brief.assumptions.map((assumption, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className={`px-2 py-1 rounded text-xs font-bold ${assumption.confidence === 'high' ? 'bg-green-100 text-green-800' :
                  assumption.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                  {assumption.confidence}
                </span>
                <p className="text-gray-700 flex-1">{assumption.text}</p>
              </div>
            ))}
          </div>
        </BriefSection>

        <BriefSection
          title="Open Questions"
          locked={brief.isApproved}
          projectId={projectId}
          enableComments={true}
        >
          <ul className="space-y-2">
            {brief.openQuestions.map((question, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700">
                <span className="text-orange-600 mt-0.5">⚠</span>
                {question}
              </li>
            ))}
          </ul>
        </BriefSection>

        <BriefSection title="Design Inspiration References" locked={brief.isApproved}>
          <p className="text-sm text-gray-600 mb-4">
            These websites demonstrate design patterns relevant to your project goals:
          </p>
          <div className="space-y-4">
            {DESIGN_REFERENCES.slice(0, 4).map((ref) => (
              <a
                key={ref.id}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-yellow-400 transition group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-black">{ref.name}</h4>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded">
                        {ref.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{ref.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {ref.highlights.slice(0, 3).map((highlight, idx) => (
                        <span key={idx} className="text-xs text-black bg-white px-2 py-1 rounded border border-gray-200">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-yellow-400 ml-4 flex-shrink-0" />
                </div>
              </a>
            ))}
          </div>
        </BriefSection>
      </div>

      {!brief.isApproved && (
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setShowChangeRequestModal(true)}
            className="flex-1 px-6 py-3 rounded-lg font-semibold
           border-2 border-gray-300 bg-white text-gray-800
           shadow-sm
           hover:bg-gray-100 hover:shadow-md
           active:scale-[0.98] active:shadow-sm
           focus:outline-none focus:ring-2 focus:ring-[#FFC627] focus:ring-offset-2
           transition-all"
          >
            Request Changes
          </button>
          <button
            onClick={onApprove}
            disabled={isApproving}
            className="flex-1 px-6 py-3 bg-[#FFC627] text-black rounded-lg font-bold hover:bg-black hover:text-white transition-all duration-300 shadow-lg disabled:opacity-50"
          >
            {isApproving ? 'Approving...' : 'Approve Brief'}
          </button>
        </div>
      )}

      {brief.isApproved && (
        <>
          <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
            <p className="text-sm text-green-900">
              <span className="font-bold">✓ Brief Approved</span> - This brief is now locked.
              {brief.approvedAt && ` Approved on ${new Date(brief.approvedAt).toLocaleDateString()}.`}
            </p>
          </div>

          {/* Change Request Button for Approved Briefs */}
          <div className="mt-4">
            <button
              onClick={() => setShowChangeRequestModal(true)}
              className="w-full px-6 py-3 border-2 border-yellow-400 text-black bg-yellow-50 rounded-lg font-bold hover:bg-yellow-400 transition"
            >
              Request Changes to Approved Brief
            </button>
          </div>

          {changeRequests.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                Change Requests ({changeRequests.length})
              </h3>
              <ChangeRequestList changeRequests={changeRequests} />
            </div>
          )}
        </>
      )}
      {showChangeRequestModal && (
        <ChangeRequestModal
          projectId={projectId}
          briefId={brief.id}
          availableSections={availableSections}
          onClose={() => setShowChangeRequestModal(false)}
        />
      )}
    </div>
  );
}
