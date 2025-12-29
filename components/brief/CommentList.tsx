'use client';

import React, { useState } from 'react';
import { Trash2, Clock, User } from 'lucide-react';
import { deleteComment } from '@/app/actions/comments';
import { useRouter } from 'next/navigation';
import type { Comment } from '@/types/brief.types';

interface CommentListProps {
  comments: Comment[];
  projectId: string;
}

export default function CommentList({ comments }: CommentListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (commentId: string, author: string) => {
    if (!confirm(`Delete comment by ${author}?`)) {
      return;
    }

    setDeletingId(commentId);

    try {
      const result = await deleteComment(commentId);

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete comment');
      }

      router.refresh();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete comment');
      setDeletingId(null);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffMs = now.getTime() - commentDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return commentDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500 italic">No comments yet.</p>
        <p className="text-xs text-gray-400 mt-1">Be the first to add feedback!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div 
          key={comment.id} 
          className="border-b-2 border-gray-200 pb-4 last:border-0 group"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-black" />
              </div>
              <div>
                <p className="text-sm font-bold text-black">{comment.author}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(comment.createdAt)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleDelete(comment.id, comment.author)}
              disabled={deletingId === comment.id}
              className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-red-50 rounded"
              title="Delete comment"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed ml-10">{comment.text}</p>
          
          <div className="ml-10 mt-2">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {comment.section}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}