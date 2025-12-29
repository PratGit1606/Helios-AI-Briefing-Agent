'use client';

import React, { useState } from 'react';
import { Clock, User, AlertCircle, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { reviewChangeRequest, deleteChangeRequest, markChangeRequestImplemented } from '@/app/actions/changeRequests';
import { useRouter } from 'next/navigation';

interface ChangeRequest {
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
}

interface ChangeRequestListProps {
  changeRequests: ChangeRequest[];
}

export default function ChangeRequestList({ changeRequests }: ChangeRequestListProps) {
  const router = useRouter();
  const [actingOnId, setActingOnId] = useState<string | null>(null);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewerName, setReviewerName] = useState('');
  const [resolution, setResolution] = useState('');

  const handleReview = async (requestId: string, status: 'approved' | 'rejected') => {
    if (!reviewerName.trim()) {
      alert('Please enter your name');
      return;
    }

    setActingOnId(requestId);

    try {
      const result = await reviewChangeRequest({
        requestId,
        status,
        reviewedBy: reviewerName.trim(),
        resolution: resolution.trim() || undefined
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to review request');
      }

      setReviewingId(null);
      setReviewerName('');
      setResolution('');
      router.refresh();
    } catch (error) {
      console.error('Error reviewing request:', error);
      alert(error instanceof Error ? error.message : 'Failed to review request');
    } finally {
      setActingOnId(null);
    }
  };

  const handleDelete = async (requestId: string, requester: string) => {
    if (!confirm(`Delete change request from ${requester}?`)) {
      return;
    }

    setActingOnId(requestId);

    try {
      const result = await deleteChangeRequest(requestId);

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete request');
      }

      router.refresh();
    } catch (error) {
      console.error('Error deleting request:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete request');
    } finally {
      setActingOnId(null);
    }
  };

  const handleMarkImplemented = async (requestId: string) => {
    if (!confirm('Mark this change request as implemented?')) {
      return;
    }

    setActingOnId(requestId);

    try {
      const result = await markChangeRequestImplemented(requestId, 'System');

      if (!result.success) {
        throw new Error(result.error || 'Failed to mark as implemented');
      }

      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Failed to update status');
    } finally {
      setActingOnId(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', icon: AlertCircle },
      approved: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', icon: XCircle },
      implemented: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', icon: CheckCircle }
    };

    const badge = badges[status as keyof typeof badges] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold ${badge.bg} ${badge.text} border-2 ${badge.border}`}>
        <Icon className="w-3 h-3" />
        {status.toUpperCase()}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      low: 'bg-gray-100 text-gray-700',
      normal: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-bold ${badges[priority as keyof typeof badges]}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  if (changeRequests.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-gray-200">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 font-semibold">No change requests yet</p>
        <p className="text-sm text-gray-500 mt-1">Changes can be requested after brief approval</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {changeRequests.map((request) => (
        <div
          key={request.id}
          className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:border-yellow-400 transition"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="font-bold text-black">{request.requester}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(request.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {getStatusBadge(request.status)}
              {getPriorityBadge(request.priority)}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Sections:</p>
            <div className="flex flex-wrap gap-2">
              {(request.sections as string[]).map((section, idx) => (
                <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                  {section}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
            <p className="text-sm text-gray-700 leading-relaxed">{request.feedback}</p>
          </div>

          {request.reviewedBy && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <p className="text-sm font-semibold text-blue-900 mb-1">
                Reviewed by {request.reviewedBy} on {request.reviewedAt && formatDate(request.reviewedAt)}
              </p>
              {request.resolution && (
                <p className="text-sm text-blue-700 mt-2">{request.resolution}</p>
              )}
            </div>
          )}

          <div className="flex gap-2">
            {request.status === 'pending' && reviewingId !== request.id && (
              <>
                <button
                  onClick={() => setReviewingId(request.id)}
                  disabled={!!actingOnId}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition disabled:opacity-50"
                >
                  Review
                </button>
                <button
                  onClick={() => handleDelete(request.id, request.requester)}
                  disabled={!!actingOnId}
                  className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  Delete
                </button>
              </>
            )}

            {request.status === 'approved' && (
              <button
                onClick={() => handleMarkImplemented(request.id)}
                disabled={!!actingOnId}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50"
              >
                Mark as Implemented
              </button>
            )}

            {reviewingId === request.id && (
              <div className="w-full space-y-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm"
                />
                <textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder="Resolution notes (optional)"
                  rows={2}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReview(request.id, 'approved')}
                    disabled={!reviewerName.trim() || !!actingOnId}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReview(request.id, 'rejected')}
                    disabled={!reviewerName.trim() || !!actingOnId}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      setReviewingId(null);
                      setReviewerName('');
                      setResolution('');
                    }}
                    className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}