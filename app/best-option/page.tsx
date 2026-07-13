"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import BottomNavigation from "@/shared/components/navigation/BottomNavigation";
import { supabase } from "@/lib/supabase";
import { useTreatment } from "@/shared/context/TreatmentContext";
import { planService } from "@/services/plan/plan.service";

import {
  buildHospitalComparison,
  Hospital,
  HospitalService,
  ServiceKeyword,
} from "@/shared/utils/hospitalComparison";

import BestOptionContent from "./BestOptionContent";

import {
  buildSaveTreatmentPlanInput,
  createRecommendationReason,
} from "./bestOption.mapper";

export default function BestOptionPage() {
  const router = useRouter();

  const {
    extractedText,
    items,
    totalAmount,
    resetTreatment,
  } = useTreatment();

  const [hospitals, setHospitals] =
    useState<Hospital[]>([]);

  const [services, setServices] =
    useState<HospitalService[]>([]);

  const [keywords, setKeywords] =
    useState<ServiceKeyword[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [
    saveErrorMessage,
    setSaveErrorMessage,
  ] = useState("");

  useEffect(() => {
    loadBestOptionData();
  }, []);

  async function loadBestOptionData() {
    try {
      setLoading(true);
      setErrorMessage("");

      const [
        hospitalsResponse,
        servicesResponse,
        keywordsResponse,
      ] = await Promise.all([
        supabase
          .from("hospitals")
          .select("*"),

        supabase
          .from("hospital_services")
          .select("*"),

        supabase
          .from("service_keywords")
          .select("*"),
      ]);

      if (hospitalsResponse.error) {
        throw hospitalsResponse.error;
      }

      if (servicesResponse.error) {
        throw servicesResponse.error;
      }

      if (keywordsResponse.error) {
        throw keywordsResponse.error;
      }

      setHospitals(
        hospitalsResponse.data ?? []
      );

      setServices(
        servicesResponse.data ?? []
      );

      setKeywords(
        keywordsResponse.data ?? []
      );
    } catch (error) {
      console.error(error);

      setErrorMessage(
        "Failed to load best option."
      );
    } finally {
      setLoading(false);
    }
  }

  const comparisonResults = useMemo(
    () =>
      buildHospitalComparison({
        hospitals,
        services,
        keywords,
        items,
        currentTotal: Number(
          totalAmount || 0
        ),
      }),
    [
      hospitals,
      services,
      keywords,
      items,
      totalAmount,
    ]
  );

  const bestOption =
    comparisonResults[0];

  const confidence =
    bestOption && items.length > 0
      ? Math.round(
          (bestOption.matchedServices /
            items.length) *
            100
        )
      : 0;

  const recommendationReason =
    bestOption
      ? createRecommendationReason(
          bestOption,
          items.length
        )
      : "";

  async function handleSavePlan() {
    if (!bestOption || saving || saved) {
      return;
    }

    try {
      setSaving(true);
      setSaveErrorMessage("");

      const saveInput =
        buildSaveTreatmentPlanInput({
          extractedText,
          totalAmount,
          items,
          comparisonResults,
        });

      await planService.saveTreatmentPlan(
        saveInput
      );

      setSaved(true);
      resetTreatment();

      router.push("/current-plans");
    } catch (error) {
      console.error(error);

      setSaveErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to save treatment plan."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#D4E0DF] px-6">
        <div className="rounded-[30px] bg-[#F8FBFA] p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-[#D4E0DF] border-t-[#476973]" />

          <p className="font-semibold text-[#476973]">
            Preparing best option...
          </p>

          <p className="mt-2 text-sm text-[#476973]/70">
            Comparing price, rating,
            guarantee, and matched services.
          </p>
        </div>
      </main>
    );
  }

  if (errorMessage || !bestOption) {
    return (
      <main className="flex min-h-screen flex-col bg-[#D4E0DF]">
        <section className="flex-1 px-6 pb-10 pt-12">
          <div className="rounded-[36px] bg-[#F8FBFA] p-6 text-center shadow-sm">
            <h1 className="font-serif text-4xl text-[#476973]">
              Best Option
            </h1>

            <p className="mt-4 text-[#476973]/75">
              {errorMessage ||
                "We could not generate a recommendation because no hospital matches were found."}
            </p>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/hospital/comparison"
                )
              }
              className="mt-8 w-full rounded-2xl bg-[#476973] py-4 font-semibold text-white"
            >
              Back to Comparison
            </button>
          </div>
        </section>

        <BottomNavigation />
      </main>
    );
  }

  return (
    <BestOptionContent
      bestOption={bestOption}
      confidence={confidence}
      totalItems={items.length}
      recommendationReason={
        recommendationReason
      }
      saving={saving}
      saved={saved}
      saveErrorMessage={
        saveErrorMessage
      }
      onSave={handleSavePlan}
      onBack={() =>
        router.push(
          "/hospital/comparison"
        )
      }
    />
  );
}