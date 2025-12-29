'use client';

import React from 'react';
import { AlertCircle, CheckCircle, XCircle, CheckCircle2, FileText, RefreshCw, CalendarClock } from 'lucide-react';
import LoadingState from '../sections/LoadingState';
import type { Artifact } from '@/types/brief.types';

interface AssumptionsTabProps {
  artifact?: Artifact;
  isGenerating: boolean;
  error: string | null;
}

interface AssumptionItem {
  text: string;
  confidence: 'low' | 'medium' | 'high';
}

interface AssumptionsContent {
  title: string;
  items: AssumptionItem[];
}

export default function AssumptionsTab({ artifact, isGenerating, error }: AssumptionsTabProps) {
  if (isGenerating) {
    return <LoadingState message="Generating assumptions log..." />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border-2 border-red-200 shadow-lg p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-lg font-bold text-red-700 mb-2">Error Loading Assumptions</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!artifact) {
    return (
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-lg font-bold text-gray-700 mb-2">No Assumptions Available</p>
          <p className="text-sm text-gray-500">Assumptions will be generated after brief approval</p>
        </div>
      </div>
    );
  }

  const content = artifact.content as unknown as AssumptionsContent;

  if (!content || !content.items) {
    return (
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-lg font-bold text-gray-700 mb-2">Invalid Assumptions Data</p>
          <p className="text-sm text-gray-500">The assumptions artifact data is malformed</p>
        </div>
      </div>
    );
  }

  const highConfidence = content.items.filter(a => a.confidence === 'high');
  const mediumConfidence = content.items.filter(a => a.confidence === 'medium');
  const lowConfidence = content.items.filter(a => a.confidence === 'low');

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <AlertCircle className="w-6 h-6 text-yellow-400" />
          <h3 className="text-2xl font-bold text-black">{content.title}</h3>
        </div>
        <p className="text-sm text-gray-600">
          Project assumptions organized by confidence level. Verify these before development.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-900">{highConfidence.length}</p>
              <p className="text-sm text-green-700 font-semibold">High Confidence</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-yellow-900">{mediumConfidence.length}</p>
              <p className="text-sm text-yellow-700 font-semibold">Medium Confidence</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-red-900">{lowConfidence.length}</p>
              <p className="text-sm text-red-700 font-semibold">Low Confidence</p>
            </div>
          </div>
        </div>
      </div>

      {highConfidence.length > 0 && (
        <div className="mb-8">
          <h4 className="font-bold text-black mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            High Confidence
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            These assumptions are likely correct and can proceed with minimal verification.
          </p>
          <div className="space-y-3">
            {highConfidence.map((assumption, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-green-100 text-green-800 border border-green-300">
                  HIGH
                </span>
                <p className="text-gray-700 flex-1">{assumption.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {mediumConfidence.length > 0 && (
        <div className="mb-8">
          <h4 className="font-bold text-black mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            Medium Confidence
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            These assumptions should be verified with stakeholders before proceeding.
          </p>
          <div className="space-y-3">
            {mediumConfidence.map((assumption, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-300">
                  MEDIUM
                </span>
                <p className="text-gray-700 flex-1">{assumption.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {lowConfidence.length > 0 && (
        <div className="mb-8">
          <h4 className="font-bold text-black mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            Low Confidence - Requires Verification
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            These assumptions are uncertain and must be confirmed before development begins.
          </p>
          <div className="space-y-3">
            {lowConfidence.map((assumption, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border-2 border-red-200">
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                  LOW
                </span>
                <p className="text-gray-700 flex-1">{assumption.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 p-6 bg-[#FFF6DB] border-2 border-[#FFC627] rounded-lg">
        <h4 className="font-bold text-black mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-black" />
          Recommended Actions
        </h4>

        <ul className="space-y-3 text-sm text-gray-800">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-black mt-0.5" />
            <span>Review all low confidence assumptions with stakeholders immediately</span>
          </li>

          <li className="flex items-start gap-3">
            <FileText className="w-4 h-4 text-black mt-0.5" />
            <span>Document verified assumptions in project requirements</span>
          </li>

          <li className="flex items-start gap-3">
            <RefreshCw className="w-4 h-4 text-black mt-0.5" />
            <span>Update assumptions as new information becomes available</span>
          </li>

          <li className="flex items-start gap-3">
            <CalendarClock className="w-4 h-4 text-black mt-0.5" />
            <span>Schedule follow-up meetings to address medium confidence items</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
