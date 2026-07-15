"use client";

import {
  Trash2,
  X,
} from "lucide-react";

import type {
  TreatmentPlan,
} from "@/services/plan/plan.types";

type DeletePlanDialogProps = {
  plan: TreatmentPlan | null;
  deleting: boolean;
  errorMessage: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeletePlanDialog({
  plan,
  deleting,
  errorMessage,
  onCancel,
  onConfirm,
}: DeletePlanDialogProps) {
  if (!plan) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D3339]/50 px-6 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-plan-title"
        className="relative w-full max-w-sm rounded-[32px] bg-[#F8FBFA] p-7 text-center shadow-2xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          aria-label="Close delete confirmation"
          onClick={onCancel}
          disabled={deleting}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#E4ECEA] text-[#365863] transition hover:bg-[#D4E0DF] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={18} />
        </button>

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
          <Trash2 size={28} />
        </div>

        <h2
          id="delete-plan-title"
          className="mt-5 font-serif text-3xl text-[#365863]"
        >
          Delete this plan?
        </h2>

        <p className="mt-3 leading-6 text-[#365863]/70">
          This will permanently delete{" "}
          <span className="font-semibold text-[#365863]">
            {plan.title ||
              "this treatment plan"}
          </span>
          . This action cannot be
          undone.
        </p>

        {errorMessage && (
          <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="mt-7 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-2xl border border-[#C8D2D0] bg-white py-3 font-semibold text-[#365863] transition hover:bg-[#EEF4F3] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {deleting ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={18} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}