"use client";

import {
  ArrowLeft,
  CheckCircle,
  MapPin,
  Save,
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
  totalItems,
  saving,
  saved,
  saveErrorMessage,
  onSave,
  onBack,
}: BestOptionContentProps) {
  const matchedServices =
    bestOption.matchedServices;

  const allServicesMatched =
    totalItems > 0 &&
    matchedServices === totalItems;

  const roundedInsuranceCompatibility =
    Math.round(
      bestOption.insuranceCompatibility
    );

  const roundedInsuranceCoveredAmount =
    Math.round(
      bestOption.insuranceCoveredAmount
    );

  const roundedPatientAmount =
    Math.round(bestOption.patientAmount);

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
            between treatment completeness, cost,
            quality and insurance.
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
            {bestOption.total.toLocaleString()}{" "}
            SAR
          </p>

          <span className="mt-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-bold text-[#476973]">
            Best Match
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="rounded-[26px] bg-[#F8FBFA] p-5 text-center shadow-sm">
            <Wallet
              size={24}
              className="mx-auto text-[#476973]"
            />

            <p className="mt-2 text-sm text-[#476973]/65">
              You Pay
            </p>

            <p className="mt-1 text-xl font-bold text-[#476973]">
              {roundedPatientAmount.toLocaleString()}{" "}
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
              {roundedInsuranceCoveredAmount.toLocaleString()}{" "}
              SAR
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
              {bestOption.hospital.rating}/5
            </p>
          </div>

          <div className="rounded-[26px] bg-[#F8FBFA] p-5 text-center shadow-sm">
            <CheckCircle
              size={24}
              className="mx-auto text-[#476973]"
            />

            <p className="mt-2 text-sm text-[#476973]/65">
              Overall Match
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

                  <p className="whitespace-nowrap font-bold text-[#476973]">
                    {item.totalPrice.toLocaleString()}{" "}
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
              {bestOption.total.toLocaleString()}{" "}
              SAR
            </p>
          </div>

          <div className="mt-3 flex justify-between rounded-2xl bg-[#E4ECEA] p-4 text-[#476973]">
            <p className="font-semibold">
              Insurance Covers
            </p>

            <p className="font-bold">
              {roundedInsuranceCoveredAmount.toLocaleString()}{" "}
              SAR
            </p>
          </div>

          <div className="mt-3 flex justify-between rounded-2xl bg-white p-4 text-[#476973]">
            <p className="font-semibold">
              Estimated Amount You Pay
            </p>

            <p className="font-bold">
              {roundedPatientAmount.toLocaleString()}{" "}
              SAR
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-[30px] bg-[#F8FBFA] p-5 shadow-sm">
          <h3 className="font-serif text-2xl text-[#476973]">
            ✨ لماذا نوصي بهذا المستشفى؟
          </h3>

          <ul
            dir="rtl"
            className="mt-4 space-y-3 text-right leading-7 text-[#476973]/85"
          >
            <li className="rounded-2xl bg-white px-4 py-3">
              •{" "}
              {allServicesMatched
                ? `تتوفر جميع خدمات خطتك العلاجية وعددها ${totalItems} خدمات.`
                : `تمت مطابقة ${matchedServices} من أصل ${totalItems} خدمات علاجية.`}
            </li>

            {bestOption.savings > 0 ? (
              <li className="rounded-2xl bg-white px-4 py-3">
                • توفير تقديري يصل إلى{" "}
                <span className="font-bold">
                  {bestOption.savings.toLocaleString()}{" "}
                  ريال.
                </span>
              </li>
            ) : bestOption.savings < 0 ? (
              <li className="rounded-2xl bg-white px-4 py-3">
                • التكلفة أعلى من الخطة الأصلية
                بمقدار{" "}
                <span className="font-bold">
                  {Math.abs(
                    bestOption.savings
                  ).toLocaleString()}{" "}
                  ريال،
                </span>{" "}
                لكن المستشفى حقق أفضل نتيجة
                إجمالية بين الخيارات المتاحة.
              </li>
            ) : (
              <li className="rounded-2xl bg-white px-4 py-3">
                • التكلفة التقديرية مساوية
                لتكلفة الخطة الأصلية.
              </li>
            )}

            <li className="rounded-2xl bg-white px-4 py-3">
              • توافق التأمين التقديري يبلغ{" "}
              <span className="font-bold">
                {roundedInsuranceCompatibility}%
              </span>
              ، ويغطي مبلغًا يصل إلى{" "}
              <span className="font-bold">
                {roundedInsuranceCoveredAmount.toLocaleString()}{" "}
                ريال.
              </span>
            </li>

            <li className="rounded-2xl bg-white px-4 py-3">
              • تقييم المستشفى{" "}
              <span className="font-bold">
                {bestOption.hospital.rating}/5
              </span>
              ، مما يعكس مستوى جودة الرعاية.
            </li>
          </ul>
        </div>

        {bestOption.unmatchedItems.length >
          0 && (
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