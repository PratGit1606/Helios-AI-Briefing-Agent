import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message: string;
}

export default function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg p-8">
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mb-4" />
        <p className="text-lg font-bold text-gray-700 mb-2">{message}</p>
        <p className="text-sm text-gray-500">This may take 15-30 seconds</p>
      </div>
    </div>
  );
}