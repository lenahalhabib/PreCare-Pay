"use client";

import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle,
  MapPin,
  Save,
  Sparkles,
  Star,
  Trophy,
  Wallet,
} from "lucide-react";

import BottomNavigation from "@/shared/components/navigation/BottomNavigation";

import type {
  ComparisonResult,
} from "./bestOption.mapper";

type BestOptionContentProps = {
  bestOption: ComparisonResult;
  totalItems: number;
  saving: boolean;
  saved: boolean;
  saveErrorMessage: string;
  onSave: () => void;
  onBack: () => void;
};

function formatAmount(
  amount: number
): string {
  return Math.round(
    Number(amount || 0)
  ).toLocaleString();
}

function buildRecommendationPoints(
  bestOption: ComparisonResult,
  totalItems: number
): string[] {
  const matchedServices =
    Number(
      bestOption.matchedServices || 0
    );

  const savings =
    Number(
      bestOption.savings || 0
    );

  const rating =
    Number(
      bestOption.hospital.rating || 0
    );

  const points: string[] = [];

  if (
    totalItems > 0 &&
    matchedServices === totalItems
  ) {
    points.push(
      "جميع خدمات الخطة العلاجية متوفرة في المستشفى."
    );
  } else {
    points.push(
      `يوفر المستشفى ${matchedServices} من أصل ${totalItems} خدمات علاجية.`
    );
  }

  if (savings > 0) {
    points.push(
      `يوفر حوالي ${formatAmount(
        savings
      )} ريال مقارنة بالخطة الأصلية.`
    );
  } else if (savings < 0) {
    points.push(
      `تكلفته أعلى من الخطة الأصلية بحوالي ${formatAmount(
        Math.abs(savings)
      )} ريال، لكنه حقق أفضل توازن بين الخيارات.`
    );
  } else {
    points.push(
      "تكلفته قريبة من تكلفة الخطة الأصلية."
    );
  }

  points.push(
    `حصل المستشفى على تقييم ${rating} من 5.`
  );

  return points;
}

export default function BestOptionContent({
  bestOption,
  totalItems,
  saving,
  saved,
  saveErrorMessage,
  onSave,
  onBack,
}: BestOptionContentProps) {
  const matchedServices =
    Number(
      bestOption.matchedServices || 0
    );

  const finalScore =
    Math.round(
      bestOption.finalScore || 0
    );

  const insuranceCoveredAmount =
    Math.round(
      bestOption.insuranceCoveredAmount ||
        0
    );

  const patientAmount =
    Math.round(
      bestOption.patientAmount || 0
    );

  const recommendationPoints =
    buildRecommendationPoints(
      bestOption,
      totalItems
    );

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
            The hospital with the best balance
            between treatment completeness,
            cost and rating.
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

          {bestOption.hospital
            .accreditation && (
            <p className="mt-3 flex items-center justify-center gap-2 text-sm opacity-85">
              <BadgeCheck size={16} />

              {
                bestOption.hospital
                  .accreditation
              }
            </p>
          )}

          <p className="mt-5 text-4xl font-bold">
            {formatAmount(
              bestOption.total
            )}{" "}
            SAR
          </p>

          <span className="mt-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-bold text-[#476973]">
            Best Match · {finalScore}%
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="rounded-[26px] bg-[#F8FBFA] p-5 text-center shadow-sm">
            <CheckCircle
              size={24}
              className="mx-auto text-[#476973]"
            />

            <p className="mt-2 text-sm text-[#476973]/65">
              Plan Completeness
            </p>

            <p className="mt-1 text-xl font-bold text-[#476973]">
              {matchedServices}/{totalItems}
            </p>
          </div>

          <div className="rounded-[26px] bg-[#F8FBFA] p-5 text-center shadow-sm">
            <Star
              size={24}
              className="mx-auto text-[#476973]"
            />

            <p className="mt-2 text-sm text-[#476973]/65">
              Hospital Rating
            </p>

            <p className="mt-1 text-xl font-bold text-[#476973]">
              {bestOption.hospital.rating}/5
            </p>
          </div>

          <div className="rounded-[26px] bg-[#F8FBFA] p-5 text-center shadow-sm">
            <Wallet
              size={24}
              className="mx-auto text-[#476973]"
            />

            <p className="mt-2 text-sm text-[#476973]/65">
              You Pay
            </p>

            <p className="mt-1 text-xl font-bold text-[#476973]">
              {formatAmount(
                patientAmount
              )}{" "}
              SAR
            </p>
          </div>

          <div className="rounded-[26px] bg-[#F8FBFA] p-5 text-center shadow-sm">
            <Wallet
              size={24}
              className="mx-auto text-[#476973]"
            />

            <p className="mt-2 text-sm text-[#476973]/65">
              Insurance Covers
            </p>

            <p className="mt-1 text-xl font-bold text-[#476973]">
              {formatAmount(
                insuranceCoveredAmount
              )}{" "}
              SAR
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
                      {formatAmount(
                        item.unitPrice
                      )}{" "}
                      SAR × {item.quantity}
                    </p>
                  </div>

                  <p className="whitespace-nowrap font-bold text-[#476973]">
                    {formatAmount(
                      item.totalPrice
                    )}{" "}
                    SAR
                  </p>
                </div>
              )
            )}
          </div>

          <div className="mt-4 flex justify-between rounded-2xl bg-[#476973] p-4 text-white">
            <p className="font-bold">
              Hospital Total
            </p>

            <p className="font-bold">
              {formatAmount(
                bestOption.total
              )}{" "}
              SAR
            </p>
          </div>

          <div className="mt-3 flex justify-between rounded-2xl bg-[#E4ECEA] p-4 text-[#476973]">
            <p className="font-semibold">
              Insurance Covers
            </p>

            <p className="font-bold">
              {formatAmount(
                insuranceCoveredAmount
              )}{" "}
              SAR
            </p>
          </div>

          <div className="mt-3 flex justify-between rounded-2xl bg-white p-4 text-[#476973]">
            <p className="font-semibold">
              Estimated Amount You Pay
            </p>

            <p className="font-bold">
              {formatAmount(
                patientAmount
              )}{" "}
              SAR
            </p>
          </div>

          <p className="mt-3 text-center text-xs leading-5 text-[#476973]/60">
            Insurance estimates are displayed
            for financial guidance only and do
            not affect hospital ranking.
          </p>
        </div>

        <div className="mt-5 rounded-[30px] bg-[#F8FBFA] p-5 shadow-sm">
          <h3 className="font-serif text-2xl text-[#476973]">
            ✨ لماذا نوصي بهذا المستشفى؟
          </h3>

          <ul
            dir="rtl"
            className="mt-4 space-y-3 rounded-2xl bg-white px-4 py-4 text-right text-[#476973]/85"
          >
            {recommendationPoints.map(
              (point, index) => (
                <li
                  key={`${point}-${index}`}
                  className="flex items-start justify-end gap-2"
                >
                  <span className="leading-7">
                    {point}
                  </span>

                  <CheckCircle
                    size={17}
                    className="mt-1 shrink-0 text-[#476973]"
                  />
                </li>
              )
            )}
          </ul>
        </div>

        {bestOption.unmatchedItems.length >
          0 && (
          <div className="mt-5 rounded-[30px] bg-yellow-50 p-5 shadow-sm">
            <h3 className="font-semibold text-yellow-800">
              Services not matched
            </h3>

            <p className="mt-2 text-sm leading-6 text-yellow-800/80">
              These services are not available
              in this hospital price list.
            </p>

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