'use client';

import React, { useState } from 'react';
import { MessageSquare, Lightbulb, CheckCircle, Edit3, Unlock, Plus } from 'lucide-react';
import type { Comment, TabType } from '@/types/brief.types';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

interface BriefSidebarProps {
  comments: Comment[];
  activeTab: TabType;
  isApproved: boolean;
  projectId: string;
}

export default function BriefSidebar({ comments, activeTab, isApproved, projectId }: BriefSidebarProps) {
  const [showAddComment, setShowAddComment] = useState(false);

  return (
    <div>
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-black flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Comments
            {comments.length > 0 && (
              <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
                {comments.length}
              </span>
            )}
          </h3>
        </div>

        <CommentList comments={comments} projectId={projectId} />

        {!showAddComment && (
          <button
            onClick={() => setShowAddComment(true)}
            className="mt-4 w-full px-4 py-2 bg-yellow-400 text-black rounded-lg text-sm font-bold hover:bg-black hover:text-white transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Comment
          </button>
        )}

        {showAddComment && (
          <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <CommentForm
              projectId={projectId}
              section="General"
              onCancel={() => setShowAddComment(false)}
              onSuccess={() => setShowAddComment(false)}
            />
          </div>
        )}
      </div>

      {activeTab === 'brief' && (
        <div className="mt-6 rounded-lg border border-[#FFC627]/40 bg-[#FFF7E0] p-4">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#8C1D40]">
            <Lightbulb className="h-4 w-4 text-[#FFC627]" />
            Next Steps
          </h4>

          <ul className="space-y-2 text-xs text-[#5A2A0C]">
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-3.5 w-3.5 text-[#8C1D40]" />
              <span>Review all sections carefully</span>
            </li>
            <li className="flex items-start gap-2">
              <MessageSquare className="mt-0.5 h-3.5 w-3.5 text-[#8C1D40]" />
              <span>Add comments for feedback</span>
            </li>
            <li className="flex items-start gap-2">
              <Edit3 className="mt-0.5 h-3.5 w-3.5 text-[#8C1D40]" />
              <span>Request changes if needed</span>
            </li>
            <li className="flex items-start gap-2">
              <Unlock className="mt-0.5 h-3.5 w-3.5 text-[#8C1D40]" />
              <span>Approve to unlock artifacts</span>
            </li>
          </ul>
        </div>
      )}

      {isApproved && activeTab !== 'brief' && (
        <div className="mt-6 rounded-lg border border-[#FFC627]/40 bg-[#FFF7E0] p-4">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#8C1D40]">
            <Lightbulb className="h-4 w-4 text-[#FFC627]" />
            About Artifacts
          </h4>
          <p className="text-xs text-[#5A2A0C] leading-relaxed">
            Artifacts are <strong>AI-generated resources</strong> created from your approved brief.
            They are intended to support <strong>planning, research, and ideation</strong>, and should be used as 
            <strong> inspiration</strong> rather than treated as <strong>final, production-ready deliverables</strong>.
          </p>

        </div>
      )}
    </div>
  );
}