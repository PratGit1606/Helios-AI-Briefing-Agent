'use client';

import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { createChangeRequest } from '@/app/actions/changeRequests';
import { useRouter } from 'next/navigation';

interface ChangeRequestModalProps {
  projectId: string;
  briefId: string;
  availableSections: string[];
  onClose: () => void;
}

export default function ChangeRequestModal({
  projectId,
  briefId,
  availableSections,
  onClose
}: ChangeRequestModalProps) {
  const router = useRouter();
  const [requester, setRequester] = useState('');
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'critical'>('normal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setSelectedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!requester.trim() || !feedback.trim() || selectedSections.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createChangeRequest({
        projectId,
        briefId,
        requester: requester.trim(),
        sections: selectedSections,
        feedback: feedback.trim(),
        priority
      });

      if (!result.success) {
        setError(result.error || 'Failed to submit change request');
        setIsSubmitting(false);
        return;
      }


      router.refresh();
      onClose();
    } catch (err) {
      console.error('Error submitting change request:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit request');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={() => !isSubmitting && onClose()} />

      <div className="relative z-10 w-full max-w-2xl rounded-lg bg-white shadow-xl border-2 border-yellow-400 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-bold text-black">Request Changes</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
              <p className="text-sm font-semibold text-red-800">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Your Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={requester}
              onChange={(e) => setRequester(e.target.value)}
              placeholder="e.g., Sarah Chen"
              disabled={isSubmitting}
              className="w-full text-black px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 disabled:bg-gray-100"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Sections Requiring Changes <span className="text-red-600">*</span>
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Select all sections that need revision
            </p>
            <div className="grid grid-cols-2 gap-2">
              {availableSections.map((section) => (
                <button
                  key={section}
                  type="button"
                  onClick={() => toggleSection(section)}
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-lg border-2 text-sm font-semibold transition ${selectedSections.includes(section)
                      ? 'bg-yellow-400 border-yellow-400 text-black'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-yellow-400'
                    } disabled:opacity-50`}
                >
                  {selectedSections.includes(section) && '✓ '}
                  {section}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Detailed Feedback <span className="text-red-600">*</span>
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Explain what changes are needed and why
            </p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Example: The tone feels too formal for our student audience. Can we make it more conversational and approachable?"
              disabled={isSubmitting}
              rows={6}
              className="text-black w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 disabled:bg-gray-100 resize-none"
              maxLength={2000}
            />
            <p className="text-xs text-gray-500 mt-1">{feedback.length}/2000 characters</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Priority Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['low', 'normal', 'high', 'critical'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setPriority(level)}
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-lg border-2 text-sm font-bold capitalize transition ${priority === level
                      ? level === 'critical'
                        ? 'bg-red-100 border-red-400 text-red-800'
                        : level === 'high'
                          ? 'bg-orange-100 border-orange-400 text-orange-800'
                          : level === 'normal'
                            ? 'bg-blue-100 border-blue-400 text-blue-800'
                            : 'bg-gray-100 border-gray-400 text-gray-800'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-yellow-400'
                    } disabled:opacity-50`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !requester.trim() || !feedback.trim() || selectedSections.length === 0}
              className="flex-1 px-6 py-3 bg-yellow-400 text-black rounded-lg font-bold hover:bg-black hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}