"use client";

import {
  ArrowLeft,
  CheckCircle,
  MapPin,
  Save,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Wallet,
} from "lucide-react";

import BottomNavigation from "@/shared/components/navigation/BottomNavigation";

import type { ComparisonResult } from "./bestOption.mapper";

type BestOptionContentProps = {
  bestOption: ComparisonResult;
  confidence: number;
  totalItems: number;
  recommendationReason: string;
  saving: boolean;
  saved: boolean;
  saveErrorMessage: string;
  onSave: () => void;
  onBack: () => void;
};

export default function BestOptionContent({
  bestOption,
  confidence,
  recommendationReason,
  saving,
  saved,
  saveErrorMessage,
  onSave,
  onBack,
}: BestOptionContentProps) {
  return (
    <main className="flex min-h-screen flex-col bg-[#D4E0DF]">
      <section className="flex-1 px-6 pb-10 pt-12">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F8FBFA]">
            <Trophy
              size={34}
              className="text-[#476973]"
            />
          </div>

          <h1 className="font-serif text-5xl text-[#476973]">
            Best Option
          </h1>

          <p className="mt-3 text-[#476973]/75">
            Based on your treatment plan and our
            hospital comparison.
          </p>
        </header>

        <div className="rounded-[36px] bg-[#476973] p-6 text-center text-white shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
            <Sparkles size={28} />
          </div>

          <p className="text-sm opacity-80">
            Recommended Hospital
          </p>

          <h2 className="mt-2 font-serif text-4xl">
            {bestOption.hospital.name}
          </h2>

          <p className="mt-2 flex items-center justify-center gap-2 text-sm opacity-85">
            <MapPin size={16} />
            {bestOption.hospital.location}
          </p>

          <p className="mt-5 text-4xl font-bold">
            {bestOption.total.toLocaleString()} SAR
          </p>

          <span className="mt-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-bold text-[#476973]">
            Best Value
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="rounded-[26px] bg-[#F8FBFA] p-5 text-center shadow-sm">
            <Wallet
              size={24}
              className="mx-auto text-[#476973]"
            />

            <p className="mt-2 text-sm text-[#476973]/65">
  {bestOption.savings >= 0
    ? "Estimated Savings"
    : "Additional Cost"}
</p>

<p className="mt-1 text-xl font-bold text-[#476973]">
  {Math.abs(bestOption.savings).toLocaleString()} SAR
</p>

          </div>

          <div className="rounded-[26px] bg-[#F8FBFA] p-5 text-center shadow-sm">
            <Star
              size={24}
              className="mx-auto text-[#476973]"
            />

            <p className="mt-2 text-sm text-[#476973]/65">
              Rating
            </p>

            <p className="mt-1 text-xl font-bold text-[#476973]">
              {bestOption.hospital.rating}
            </p>
          </div>

          <div className="rounded-[26px] bg-[#F8FBFA] p-5 text-center shadow-sm">
            <ShieldCheck
              size={24}
              className="mx-auto text-[#476973]"
            />

            <p className="mt-2 text-sm text-[#476973]/65">
              Guarantee
            </p>

            <p className="mt-1 text-xl font-bold text-[#476973]">
              {bestOption.hospital.guarantee_days} days
            </p>
          </div>

          <div className="rounded-[26px] bg-[#F8FBFA] p-5 text-center shadow-sm">
            <CheckCircle
              size={24}
              className="mx-auto text-[#476973]"
            />

            <p className="mt-2 text-sm text-[#476973]/65">
              Confidence
            </p>

            <p className="mt-1 text-xl font-bold text-[#476973]">
              {confidence}%
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-[30px] bg-[#F8FBFA] p-5 shadow-sm">
          <h3 className="font-serif text-2xl text-[#476973]">
            Price Breakdown
          </h3>

          <div className="mt-4 space-y-3">
            {bestOption.matchedItems.map(
              (item, index) => (
                <div
                  key={`${item.serviceCode}-${index}`}
                  className="flex justify-between gap-4 rounded-2xl bg-white p-4"
                >
                  <div>
                    <p className="font-semibold text-[#476973]">
                      {item.originalName}
                    </p>

                    <p className="mt-1 text-xs text-[#476973]/60">
                      {item.unitPrice.toLocaleString()}{" "}
                      SAR × {item.quantity}
                    </p>
                  </div>

                  <p className="font-bold text-[#476973]">
                    {item.totalPrice.toLocaleString()}{" "}
                    SAR
                  </p>
                </div>
              )
            )}
          </div>

          <div className="mt-4 flex justify-between rounded-2xl bg-[#476973] p-4 text-white">
            <p className="font-bold">Total</p>

            <p className="font-bold">
              {bestOption.total.toLocaleString()} SAR
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-[30px] bg-[#F8FBFA] p-5 shadow-sm">
          <h3 className="font-serif text-2xl text-[#476973]">
            ✨ لماذا نوصي بهذا المستشفى؟
          </h3>

          <p className="mt-3 leading-7 text-[#476973]/80">
            {recommendationReason}
          </p>
        </div>

        {bestOption.unmatchedItems.length > 0 && (
          <div className="mt-5 rounded-[30px] bg-yellow-50 p-5 shadow-sm">
            <h3 className="font-semibold text-yellow-800">
              Services not matched
            </h3>

            <ul className="mt-3 space-y-1 text-sm text-yellow-800">
              {bestOption.unmatchedItems.map(
                (item, index) => (
                  <li key={`${item}-${index}`}>
                    • {item}
                  </li>
                )
              )}
            </ul>
          </div>
        )}

        {saveErrorMessage && (
          <p className="mt-5 rounded-2xl bg-red-50 p-3 text-center text-sm text-red-600">
            {saveErrorMessage}
          </p>
        )}

        <button
          type="button"
          onClick={onSave}
          disabled={saving || saved}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#476973] py-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Saving Plan...
            </>
          ) : saved ? (
            <>
              <CheckCircle size={20} />
              Plan Saved
            </>
          ) : (
            <>
              <Save size={20} />
              Save Treatment Plan
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onBack}
          disabled={saving}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#476973] py-4 font-semibold text-[#476973] disabled:opacity-60"
        >
          <ArrowLeft size={20} />
          Back to Comparison
        </button>
      </section>

      <BottomNavigation />
    </main>
  );
}