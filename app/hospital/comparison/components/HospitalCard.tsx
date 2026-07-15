"use client";

import {
  BadgeCheck,
  MapPin,
  Star,
  Trophy,
} from "lucide-react";

import type {
  ComparisonResult,
} from "@/shared/utils/hospitalComparison";

import TreatmentPrices from "./TreatmentPrices";
import InsuranceSelector from "./InsuranceSelector";
import MissingServices from "./MissingServices";

type HospitalCardProps = {
  result: ComparisonResult;
  isBestMatch: boolean;
};

function formatAmount(
  amount: number
): string {
  return Math.round(
    Number(amount || 0)
  ).toLocaleString();
}

export default function HospitalCard({
  result,
  isBestMatch,
}: HospitalCardProps) {
  return (
    <article className="rounded-[30px] bg-[#F8FBFA] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {isBestMatch && (
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#476973] px-3 py-1.5 text-xs font-semibold text-white">
              <Trophy size={14} />
              Best Match
            </div>
          )}

          <h2 className="font-serif text-2xl text-[#476973]">
            {result.hospital.name}
          </h2>

          <p className="mt-2 flex items-center gap-2 text-sm text-[#476973]/70">
            <MapPin
              size={16}
              className="shrink-0"
            />

            {result.hospital.location}
          </p>

          {result.hospital.accreditation && (
            <p className="mt-2 flex items-center gap-2 text-sm text-[#476973]/70">
              <BadgeCheck
                size={16}
                className="shrink-0"
              />

              {
                result.hospital
                  .accreditation
              }
            </p>
          )}
        </div>

        <div className="shrink-0 text-right">
          <p className="text-xs text-[#476973]/60">
            Total Price
          </p>

          <p className="mt-1 text-2xl font-bold text-[#476973]">
            {formatAmount(result.total)}
          </p>

          <p className="text-xs text-[#476973]/60">
            SAR
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-white p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Star
              size={20}
              className="text-[#476973]"
            />

            <p className="font-semibold text-[#476973]">
              Hospital Rating
            </p>
          </div>

          <p className="font-bold text-[#476973]">
            {result.hospital.rating}/5
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <TreatmentPrices
          items={result.matchedItems}
          total={result.total}
        />

        <InsuranceSelector
          options={result.insuranceOptions}
        />

        {result.unmatchedItems.length >
          0 && (
          <MissingServices
            items={
              result.unmatchedItems
            }
          />
        )}
      </div>
    </article>
  );
}