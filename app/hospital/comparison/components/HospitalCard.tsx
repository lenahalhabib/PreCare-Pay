import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";

import type { ComparisonResult } from "@/shared/utils/hospitalComparison";

type HospitalCardProps = {
  result: ComparisonResult;
  isBestMatch: boolean;
  totalTreatmentServices: number;
  isExpanded?: boolean;
  onToggleDetails?: () => void;
};

export default function HospitalCard({
  result,
  isBestMatch,
  totalTreatmentServices,
  isExpanded = false,
  onToggleDetails,
}: HospitalCardProps) {
  return (
    <article className="rounded-[30px] bg-[#F8FBFA] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#476973]">
            {result.hospital.name}
          </h2>

          <p className="mt-2 flex items-center gap-2 text-sm text-[#476973]/70">
            <MapPin size={16} />
            {result.hospital.location}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-[#476973]/60">
            Total Price
          </p>

          <p className="mt-1 text-2xl font-bold text-[#476973]">
            {result.total.toLocaleString()} SAR
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-center">
        <div className="rounded-2xl bg-white p-4">
          <Star
            size={20}
            className="mx-auto text-[#476973]"
          />

          <p className="mt-2 text-lg font-bold text-[#476973]">
            {result.hospital.rating}/5
          </p>

          <p className="text-xs text-[#476973]/60">
            Rating
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4">
          <CheckCircle
            size={20}
            className="mx-auto text-[#476973]"
          />

          <p className="mt-2 text-lg font-bold text-[#476973]">
            {result.matchedServices}/
            {totalTreatmentServices}
          </p>

          <p className="text-xs text-[#476973]/60">
            Matched Services
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggleDetails}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#476973] py-3 font-semibold text-[#476973]"
      >
        {isExpanded
          ? "Hide Details"
          : "View Prices & Insurance"}

        {isExpanded ? (
          <ChevronUp size={18} />
        ) : (
          <ChevronDown size={18} />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="rounded-[24px] bg-white p-4">
            <h3 className="font-serif text-xl text-[#476973]">
              Treatment Prices
            </h3>

            <div className="mt-4 space-y-3">
              {result.matchedItems.map(
                (item, itemIndex) => (
                  <div
                    key={`${item.serviceCode}-${itemIndex}`}
                    className="rounded-2xl bg-[#F8FBFA] p-4"
                  >
                    <div className="flex justify-between gap-4">
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
                  </div>
                )
              )}
            </div>

            <div className="mt-4 flex justify-between rounded-2xl bg-[#476973] p-4 text-white">
              <p className="font-bold">
                Hospital Total
              </p>

              <p className="font-bold">
                {result.total.toLocaleString()} SAR
              </p>
            </div>
          </div>

          <div className="rounded-[24px] bg-[#E4ECEA] p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck
                size={20}
                className="text-[#476973]"
              />

              <h3 className="font-serif text-xl text-[#476973]">
                Insurance Options
              </h3>
            </div>

            <p className="mt-2 text-xs leading-5 text-[#476973]/60">
              Estimated coverage using demo
              insurance data.
            </p>

            {result.insuranceOptions.length ===
            0 ? (
              <p className="mt-4 rounded-2xl bg-white p-4 text-sm text-[#476973]/70">
                Insurance data could not be
                loaded.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {result.insuranceOptions.map(
                  (option) => (
                    <div
                      key={option.companyId}
                      className="rounded-2xl bg-white p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[#476973]">
                            {option.companyName}
                          </p>

                          <p className="mt-1 text-xs text-[#476973]/60">
                            {formatPlanType(
                              option.planType
                            )}{" "}
                            Plan
                          </p>
                        </div>

                        <p className="text-sm font-bold text-[#476973]">
                          {Math.round(
                            option.compatibilityPercentage
                          )}
                          % coverage
                        </p>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-[#F8FBFA] p-3">
                          <p className="text-xs text-[#476973]/60">
                            Insurance Covers
                          </p>

                          <p className="mt-1 font-bold text-[#476973]">
                            {Math.round(
                              option.coveredAmount
                            ).toLocaleString()}{" "}
                            SAR
                          </p>
                        </div>

                        <div className="rounded-xl bg-[#F8FBFA] p-3 text-right">
                          <p className="text-xs text-[#476973]/60">
                            You Pay
                          </p>

                          <p className="mt-1 font-bold text-[#476973]">
                            {Math.round(
                              option.patientAmount
                            ).toLocaleString()}{" "}
                            SAR
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {result.unmatchedItems.length >
            0 && (
            <div className="rounded-2xl bg-yellow-50 p-4">
              <p className="font-semibold text-yellow-800">
                Services Not Available
              </p>

              <ul className="mt-2 space-y-1 text-sm text-yellow-800">
                {result.unmatchedItems.map(
                  (item, itemIndex) => (
                    <li
                      key={`${item}-${itemIndex}`}
                    >
                      • {item}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function formatPlanType(
  planType: string
): string {
  return (
    planType.charAt(0).toUpperCase() +
    planType.slice(1).toLowerCase()
  );
}