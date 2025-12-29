'use client';

import React from 'react';
import { Lock } from 'lucide-react';
import AddCommentButton from '../AddCommentButton';

interface BriefSectionProps {
  title: string;
  children: React.ReactNode;
  locked: boolean;
  projectId?: string;
  enableComments?: boolean;
}

export default function BriefSection({ 
  title, 
  children, 
  locked, 
  projectId,
  enableComments = false 
}: BriefSectionProps) {
  return (
    <div className="mb-8 last:mb-0">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-lg font-bold text-black">{title}</h3>
        {locked && <Lock className="w-4 h-4 text-gray-400" />}
      </div>
      <div className={locked ? 'pointer-events-none' : ''}>
        {children}
      </div>
      
      {/* Add Comment Button for this section */}
      {enableComments && projectId && (
        <AddCommentButton
          projectId={projectId}
          section={title}
          isLocked={locked}
        />
      )}
    </div>
  );
}