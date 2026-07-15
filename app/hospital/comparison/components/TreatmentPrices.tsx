"use client";

import {
  useState,
} from "react";

import {
  ChevronDown,
  ChevronUp,
  ReceiptText,
} from "lucide-react";

import type {
  MatchedItem,
} from "@/shared/utils/hospitalComparison";

type TreatmentPricesProps = {
  items: MatchedItem[];
  total: number;
};

function formatAmount(
  amount: number
): string {
  return Math.round(
    Number(amount || 0)
  ).toLocaleString();
}

export default function TreatmentPrices({
  items,
  total,
}: TreatmentPricesProps) {
  const [
    opened,
    setOpened,
  ] = useState(false);

  return (
    <section className="overflow-hidden rounded-[24px] bg-white">
      <button
        type="button"
        onClick={() =>
          setOpened(
            (current) => !current
          )
        }
        aria-expanded={opened}
        className="flex w-full items-center justify-between gap-4 p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <ReceiptText
            size={20}
            className="text-[#476973]"
          />

          <div>
            <p className="font-semibold text-[#476973]">
              Treatment Prices
            </p>

            <p className="mt-1 text-xs text-[#476973]/60">
              {items.length} matched{" "}
              {items.length === 1
                ? "service"
                : "services"}
            </p>
          </div>
        </div>

        {opened ? (
          <ChevronUp
            size={20}
            className="text-[#476973]"
          />
        ) : (
          <ChevronDown
            size={20}
            className="text-[#476973]"
          />
        )}
      </button>

      {opened && (
        <div className="border-t border-[#E4ECEA] p-4">
          {items.length === 0 ? (
            <p className="rounded-2xl bg-[#F8FBFA] p-4 text-sm text-[#476973]/70">
              No treatment prices are
              available.
            </p>
          ) : (
            <div className="space-y-3">
              {items.map(
                (item, index) => (
                  <div
                    key={`${item.serviceCode}-${index}`}
                    className="rounded-2xl bg-[#F8FBFA] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-[#476973]">
                          {
                            item.originalName
                          }
                        </p>

                        <p className="mt-1 text-xs text-[#476973]/60">
                          {formatAmount(
                            item.unitPrice
                          )}{" "}
                          SAR ×{" "}
                          {item.quantity}
                        </p>
                      </div>

                      <p className="whitespace-nowrap font-bold text-[#476973]">
                        {formatAmount(
                          item.totalPrice
                        )}{" "}
                        SAR
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#476973] p-4 text-white">
            <p className="font-bold">
              Hospital Total
            </p>

            <p className="font-bold">
              {formatAmount(total)} SAR
            </p>
          </div>
        </div>
      )}
    </section>
  );
}