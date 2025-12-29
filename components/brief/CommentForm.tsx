'use client';

import React, { useState } from 'react';
import { Send, X } from 'lucide-react';
import { addComment } from '@/app/actions/comments';
import { useRouter } from 'next/navigation';

interface CommentFormProps {
  projectId: string;
  section: string;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function CommentForm({ projectId, section, onCancel, onSuccess }: CommentFormProps) {
  const router = useRouter();
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!author.trim() || !text.trim()) {
      setError('Name and comment are required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await addComment({
        projectId,
        author: author.trim(),
        text: text.trim(),
        section
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to add comment');
      }

      setAuthor('');
      setText('');
      
      router.refresh();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      setError(err instanceof Error ? err.message : 'Failed to add comment');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg">
          <p className="text-sm text-red-800 font-semibold">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-black mb-1">
          Your Name
        </label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="e.g., Sarah Chen"
          disabled={isSubmitting}
          className="text-black w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 disabled:bg-gray-100"
          maxLength={100}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-black mb-1">
          Comment on: {section}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add your feedback or questions..."
          disabled={isSubmitting}
          rows={3}
          className="text-black w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 disabled:bg-gray-100 resize-none"
          maxLength={2000}
        />
        <p className="text-xs text-gray-500 mt-1">
          {text.length}/2000 characters
        </p>
      </div>

      <div className="flex gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition disabled:opacity-50"
          >
            <X className="w-4 h-4 inline mr-1" />
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !author.trim() || !text.trim()}
          className="flex-1 px-4 py-2 bg-yellow-400 text-black rounded-lg text-sm font-bold hover:bg-black hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4 inline mr-1" />
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
}