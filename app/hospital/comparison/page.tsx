"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import BottomNavigation from "@/shared/components/navigation/BottomNavigation";
import { useTreatment } from "@/shared/context/TreatmentContext";

import {
  buildHospitalComparison,
} from "@/shared/utils/hospitalComparison";

import {
  comparisonService,
  type ComparisonData,
} from "@/services/comparison/comparison.service";

import HospitalCard from "./components/HospitalCard";

const SELECTED_INSURANCE_STORAGE_KEY =
  "selectedInsuranceCompanyId";

export default function HospitalComparisonPage() {
  const router = useRouter();

  const {
    items,
    totalAmount,
  } = useTreatment();

  const [
    comparisonData,
    setComparisonData,
  ] = useState<ComparisonData | null>(
    null
  );

  const [
    selectedInsuranceCompanyId,
    setSelectedInsuranceCompanyId,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  useEffect(() => {
    loadComparisonData();
  }, []);

  async function loadComparisonData() {
    try {
      setLoading(true);
      setErrorMessage("");

      const data =
        await comparisonService
          .getComparisonData();

      setComparisonData(data);

      const savedCompanyId =
        window.sessionStorage.getItem(
          SELECTED_INSURANCE_STORAGE_KEY
        );

      const savedCompanyExists =
        data.insuranceCompanies.some(
          (company) =>
            company.id ===
            savedCompanyId
        );

      if (
        savedCompanyId &&
        savedCompanyExists
      ) {
        setSelectedInsuranceCompanyId(
          savedCompanyId
        );

        return;
      }

      const defaultCompany =
        data.insuranceCompanies.find(
          (company) =>
            company.plan_type ===
            "BASIC"
        ) ??
        data.insuranceCompanies[0];

      if (!defaultCompany) {
        return;
      }

      setSelectedInsuranceCompanyId(
        defaultCompany.id
      );

      window.sessionStorage.setItem(
        SELECTED_INSURANCE_STORAGE_KEY,
        defaultCompany.id
      );
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to load hospital comparison."
      );
    } finally {
      setLoading(false);
    }
  }

  const comparisonResults =
    useMemo(() => {
      if (!comparisonData) {
        return [];
      }

      return buildHospitalComparison({
        hospitals:
          comparisonData.hospitals,

        services:
          comparisonData
            .hospitalServices,

        keywords:
          comparisonData
            .serviceKeywords,

        serviceDefinitions:
          comparisonData
            .serviceDefinitions,

        insuranceCompanies:
          comparisonData
            .insuranceCompanies,

        insuranceCoverage:
          comparisonData
            .insuranceCoverage,

        selectedInsuranceCompanyId:
          selectedInsuranceCompanyId ||
          null,

        items,

        currentTotal:
          Number(totalAmount || 0),
      });
    }, [
      comparisonData,
      selectedInsuranceCompanyId,
      items,
      totalAmount,
    ]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#D4E0DF] px-6">
        <div className="rounded-[30px] bg-[#F8FBFA] p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-[#D4E0DF] border-t-[#476973]" />

          <p className="font-semibold text-[#476973]">
            Comparing hospitals...
          </p>

          <p className="mt-2 text-sm text-[#476973]/70">
            Analyzing treatment
            completeness, cost and
            hospital rating.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#D4E0DF]">
      <section className="flex-1 px-6 pb-10 pt-12">
        <header className="mb-8 text-center">
          <h1 className="font-serif text-4xl text-[#476973]">
            Hospital Comparison
          </h1>

          <p className="mt-3 text-[#476973]/75">
            Compare hospitals based on
            treatment availability, price
            and rating.
          </p>
        </header>

        {errorMessage && (
          <div className="mb-5 rounded-2xl bg-red-50 p-4 text-center">
            <p className="text-sm text-red-600">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={
                loadComparisonData
              }
              className="mt-4 rounded-2xl bg-red-600 px-6 py-3 font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="mb-6 rounded-[30px] bg-[#476973] p-5 text-white shadow-sm">
          <p className="text-sm opacity-80">
            Your current plan
          </p>

          <p className="mt-1 text-3xl font-bold">
            {Number(
              totalAmount || 0
            ).toLocaleString()}{" "}
            SAR
          </p>

          <p className="mt-2 text-sm text-white/70">
            {items.length} treatment{" "}
            {items.length === 1
              ? "service"
              : "services"}
          </p>
        </div>

        {!errorMessage &&
        comparisonResults.length ===
          0 ? (
          <div className="rounded-[36px] bg-[#F8FBFA] p-6 text-center shadow-sm">
            <h2 className="font-serif text-3xl text-[#476973]">
              No Matches Found
            </h2>

            <p className="mt-4 text-[#476973]/75">
              We could not match your
              treatment services with the
              available hospital prices.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/review-plan"
                )
              }
              className="mt-8 w-full rounded-2xl bg-[#476973] py-4 font-semibold text-white"
            >
              Back to Review
            </button>
          </div>
        ) : (
          !errorMessage && (
            <div className="space-y-5">
              {comparisonResults.map(
                (result, index) => (
                  <HospitalCard
                    key={
                      result.hospital.id
                    }
                    result={result}
                    isBestMatch={
                      index === 0
                    }
                  />
                )
              )}

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/best-option"
                  )
                }
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#476973] py-4 font-semibold text-white"
              >
                View Best Option
                <ArrowRight
                  size={20}
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/review-plan"
                  )
                }
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#476973] py-4 font-semibold text-[#476973]"
              >
                <ArrowLeft
                  size={20}
                />
                Back to Review
              </button>
            </div>
          )
        )}
      </section>

      <BottomNavigation />
    </main>
  );
}