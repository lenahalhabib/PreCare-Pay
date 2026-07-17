"use client";

import { useState } from "react";

import {
  BadgeCheck,
  Check,
  ChevronDown,
  CreditCard,
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

type FinancingCalculation = {
  monthlyPayment: number;
  administrativeFee: number;
  financedAmount: number;
  totalPayable: number;
};

const FINANCING_MONTHS = 18;
const ANNUAL_RATE = 6;
const ADMINISTRATIVE_FEE_RATE = 0.5;

function formatAmount(amount: number): string {
  return Math.round(
    Number(amount || 0)
  ).toLocaleString();
}

function calculateFinancing(
  treatmentCost: number
): FinancingCalculation {
  const safeTreatmentCost = Math.max(
    Number(treatmentCost || 0),
    0
  );

  const administrativeFee =
    safeTreatmentCost *
    (ADMINISTRATIVE_FEE_RATE / 100);

  const financedAmount =
    safeTreatmentCost + administrativeFee;

  const monthlyRate =
    ANNUAL_RATE / 12 / 100;

  if (monthlyRate === 0) {
    const monthlyPayment =
      financedAmount / FINANCING_MONTHS;

    return {
      monthlyPayment,
      administrativeFee,
      financedAmount,
      totalPayable: monthlyPayment * FINANCING_MONTHS,
    };
  }

  const rateFactor = Math.pow(
    1 + monthlyRate,
    FINANCING_MONTHS
  );

  const monthlyPayment =
    financedAmount *
    ((monthlyRate * rateFactor) /
      (rateFactor - 1));

  const totalPayable =
    monthlyPayment * FINANCING_MONTHS;

  return {
    monthlyPayment,
    administrativeFee,
    financedAmount,
    totalPayable,
  };
}

export default function HospitalCard({
  result,
  isBestMatch,
}: HospitalCardProps) {
  const [isFinancingOpen, setIsFinancingOpen] =
    useState(false);

  const financing = calculateFinancing(
    result.total
  );

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

              {result.hospital.accreditation}
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

        <div className="overflow-hidden rounded-2xl bg-white">
          <button
            type="button"
            onClick={() =>
              setIsFinancingOpen(
                (previousValue) =>
                  !previousValue
              )
            }
            className="flex w-full items-center justify-between gap-4 p-4 text-left"
            aria-expanded={isFinancingOpen}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D4E0DF] text-[#476973]">
                <CreditCard size={19} />
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-[#476973]">
                  With Nama Card
                </p>

                <p className="mt-0.5 text-sm text-[#476973]/70">
                  Pay only{" "}
                  <span className="font-semibold text-[#476973]">
                    {formatAmount(
                      financing.monthlyPayment
                    )}{" "}
                    SAR monthly
                  </span>
                </p>
              </div>
            </div>

            <ChevronDown
              size={20}
              className={`shrink-0 text-[#476973] transition-transform ${
                isFinancingOpen
                  ? "rotate-180"
                  : ""
              }`}
            />
          </button>

          {isFinancingOpen && (
            <div className="border-t border-[#D4E0DF] px-4 pb-4 pt-5">
              <div className="text-center">
                <p className="flex items-center justify-center gap-2 text-sm font-semibold text-[#476973]">
                  <CreditCard size={17} />
                  Estimated Monthly Payment
                </p>

                <p className="mt-2 text-3xl font-bold text-[#476973]">
                  {formatAmount(
                    financing.monthlyPayment
                  )}{" "}
                  SAR
                </p>

                <p className="mt-1 text-sm text-[#476973]/65">
                  per month for{" "}
                  {FINANCING_MONTHS} months
                </p>

                <p className="mt-4 text-sm text-[#476973]/60">
                  instead of paying
                </p>

                <p className="mt-1 text-lg font-bold text-[#476973]">
                  {formatAmount(result.total)} SAR
                  upfront
                </p>
              </div>

              <div className="mt-5 space-y-3 rounded-2xl bg-[#F8FBFA] p-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-[#476973]/65">
                    Financing period
                  </span>

                  <span className="font-semibold text-[#476973]">
                    {FINANCING_MONTHS} months
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-[#476973]/65">
                    Annual rate
                  </span>

                  <span className="font-semibold text-[#476973]">
                    {ANNUAL_RATE}%
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-[#476973]/65">
                    Administrative fee
                  </span>

                  <span className="font-semibold text-[#476973]">
                    {formatAmount(
                      financing.administrativeFee
                    )}{" "}
                    SAR
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-[#D4E0DF] pt-3 text-sm">
                  <span className="text-[#476973]/65">
                    Estimated total payable
                  </span>

                  <span className="font-bold text-[#476973]">
                    {formatAmount(
                      financing.totalPayable
                    )}{" "}
                    SAR
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <p className="flex items-center gap-2 text-sm text-[#476973]">
                  <Check
                    size={17}
                    className="shrink-0"
                  />
                  Installment up to 18 months
                </p>

                <p className="flex items-center gap-2 text-sm text-[#476973]">
                  <Check
                    size={17}
                    className="shrink-0"
                  />
                  Instant eligibility check
                </p>

                <p className="flex items-center gap-2 text-sm text-[#476973]">
                  <Check
                    size={17}
                    className="shrink-0"
                  />
                  Digital application
                </p>
              </div>

              <p className="mt-5 text-xs leading-5 text-[#476973]/55">
                Illustrative financing estimate.
                Final rate, fees, eligibility and
                monthly payment are determined by
                the financing provider.
              </p>
            </div>
          )}
        </div>

        {result.unmatchedItems.length > 0 && (
          <MissingServices
            items={result.unmatchedItems}
          />
        )}
      </div>
    </article>
  );
}