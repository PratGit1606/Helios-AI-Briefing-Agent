'use client';

import React, { useState } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import CommentForm from './CommentForm';

interface AddCommentButtonProps {
  projectId: string;
  section: string;
  isLocked: boolean;
}

export default function AddCommentButton({ projectId, section, isLocked }: AddCommentButtonProps) {
  const [showForm, setShowForm] = useState(false);

  if (isLocked) {
    return null;
  }

  if (showForm) {
    return (
      <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
        <CommentForm
          projectId={projectId}
          section={section}
          onCancel={() => setShowForm(false)}
          onSuccess={() => setShowForm(false)}
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:border-yellow-400 hover:bg-yellow-50 transition"
    >
      <MessageSquarePlus className="w-4 h-4" />
      Add Comment
    </button>
  );
}