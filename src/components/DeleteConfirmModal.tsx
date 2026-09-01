"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#15160e] border border-red-500/30 rounded-3xl p-6 md:p-8 max-w-md w-full space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-xs text-neutral-400 mt-1">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-5 py-2.5 bg-neutral-800 text-neutral-300 rounded-xl text-xs font-bold uppercase hover:bg-neutral-700 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-xs font-black uppercase hover:bg-red-500 transition-all flex items-center gap-2 shadow-lg"
          >
            {isDeleting ? "Deleting..." : "Delete Item"}
          </button>
        </div>
      </div>
    </div>
  );
}
