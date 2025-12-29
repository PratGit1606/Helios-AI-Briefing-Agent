import React from 'react';

interface ApprovalModalProps {
  isApproving: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ApprovalModal({ isApproving, onConfirm, onCancel }: ApprovalModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => !isApproving && onCancel()}
      />

      <div className="relative z-10 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl border-2 border-[#FFC627] mx-4">
        <h3 className="text-lg font-bold text-[#8C1D40]">
          Approve Brief
        </h3>

        <p className="mt-2 text-sm text-gray-700 leading-relaxed">
          Are you sure you want to approve this brief?
          <br />
          <span className="font-semibold">
            This action will lock the brief and enable artifact generation.
          </span>
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            disabled={isApproving}
            onClick={onCancel}
            className="rounded-lg border-2 border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            disabled={isApproving}
            onClick={onConfirm}
            className="rounded-lg bg-[#FFC627] px-4 py-2 text-sm font-bold text-black hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50"
          >
            {isApproving ? 'Approving...' : 'Approve'}
          </button>
        </div>
      </div>
    </div>
  );
}