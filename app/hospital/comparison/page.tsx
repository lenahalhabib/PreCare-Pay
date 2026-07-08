"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";
import BottomNavigation from "@/shared/components/navigation/BottomNavigation";
import { supabase } from "@/lib/supabase";
import { useTreatment } from "@/shared/context/TreatmentContext";
import {
  buildHospitalComparison,
  Hospital,
  HospitalService,
  ServiceKeyword,
} from "@/shared/utils/hospitalComparison";

export default function HospitalComparisonPage() {
  const router = useRouter();
  const { items, totalAmount } = useTreatment();

  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [services, setServices] = useState<HospitalService[]>([]);
  const [keywords, setKeywords] = useState<ServiceKeyword[]>([]);
  const [expandedHospitalId, setExpandedHospitalId] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadComparisonData();
  }, []);

  async function loadComparisonData() {
    try {
      setLoading(true);
      setErrorMessage("");

      const { data: hospitalsData, error: hospitalsError } = await supabase
        .from("hospitals")
        .select("*");

      if (hospitalsError) throw hospitalsError;

      const { data: servicesData, error: servicesError } = await supabase
        .from("hospital_services")
        .select("*");

      if (servicesError) throw servicesError;

      const { data: keywordsData, error: keywordsError } = await supabase
        .from("service_keywords")
        .select("*");

      if (keywordsError) throw keywordsError;

      setHospitals(hospitalsData || []);
      setServices(servicesData || []);
      setKeywords(keywordsData || []);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to load hospital comparison.");
    } finally {
      setLoading(false);
    }
  }

  const comparisonResults = useMemo(() => {
    return buildHospitalComparison({
      hospitals,
      services,
      keywords,
      items,
      currentTotal: Number(totalAmount || 0),
    });
  }, [hospitals, services, keywords, items, totalAmount]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#D4E0DF] flex items-center justify-center px-6">
        <div className="rounded-[30px] bg-[#F8FBFA] p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-[#D4E0DF] border-t-[#476973]" />
          <p className="font-semibold text-[#476973]">
            Comparing hospitals...
          </p>
          <p className="mt-2 text-sm text-[#476973]/70">
            Matching your treatment items with hospital prices.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#D4E0DF] flex flex-col">
      <section className="flex-1 px-6 pt-12 pb-10">
        <header className="mb-8 text-center">
          <h1 className="font-serif text-4xl text-[#476973]">
            Hospital Comparison
          </h1>

          <p className="mt-3 text-[#476973]/75">
            Compare your treatment plan with available hospital prices.
          </p>
        </header>

        {errorMessage && (
          <p className="mb-5 rounded-2xl bg-red-50 p-3 text-center text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        <div className="mb-6 rounded-[30px] bg-[#476973] p-5 text-white shadow-sm">
          <p className="text-sm opacity-80">Your current plan</p>
          <p className="mt-1 text-3xl font-bold">
            {Number(totalAmount || 0).toLocaleString()} SAR
          </p>
        </div>

        {comparisonResults.length === 0 ? (
          <div className="rounded-[36px] bg-[#F8FBFA] p-6 text-center shadow-sm">
            <h2 className="font-serif text-3xl text-[#476973]">
              No matches found
            </h2>

            <p className="mt-4 text-[#476973]/75">
              We could not match your treatment services with hospital prices.
            </p>

            <button
              onClick={() => router.push("/review-plan")}
              className="mt-8 w-full rounded-2xl bg-[#476973] py-4 font-semibold text-white"
            >
              Back to Review
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {comparisonResults.map((result, index) => {
              const isExpanded = expandedHospitalId === result.hospital.id;

              return (
                <div
                  key={result.hospital.id}
                  className="rounded-[30px] bg-[#F8FBFA] p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      {index === 0 && (
                        <span className="rounded-full bg-[#D4E0DF] px-3 py-1 text-xs font-bold text-[#476973]">
                          Best Price
                        </span>
                      )}

                      <h2 className="mt-3 font-serif text-2xl text-[#476973]">
                        {result.hospital.name}
                      </h2>

                      <p className="mt-2 flex items-center gap-2 text-sm text-[#476973]/70">
                        <MapPin size={16} />
                        {result.hospital.location}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#476973]">
                        {result.total.toLocaleString()} SAR
                      </p>

                      {result.savings > 0 && (
                        <p className="mt-1 text-sm font-semibold text-green-700">
                          Save {result.savings.toLocaleString()} SAR
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-2xl bg-white p-3">
                      <Star size={18} className="mx-auto text-[#476973]" />
                      <p className="mt-1 text-sm font-semibold text-[#476973]">
                        {result.hospital.rating}
                      </p>
                      <p className="text-xs text-[#476973]/60">Rating</p>
                    </div>

                    <div className="rounded-2xl bg-white p-3">
                      <ShieldCheck
                        size={18}
                        className="mx-auto text-[#476973]"
                      />
                      <p className="mt-1 text-sm font-semibold text-[#476973]">
                        {result.hospital.guarantee_days} days
                      </p>
                      <p className="text-xs text-[#476973]/60">Guarantee</p>
                    </div>

                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-sm font-semibold text-[#476973]">
                        {result.duration} days
                      </p>
                      <p className="mt-1 text-xs text-[#476973]/60">
                        Duration
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-[#476973]/70">
                    Matched {result.matchedServices} treatment services •{" "}
                    {result.hospital.accreditation}
                  </p>

                  <button
                    onClick={() =>
                      setExpandedHospitalId(isExpanded ? null : result.hospital.id)
                    }
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#476973] py-3 font-semibold text-[#476973]"
                  >
                    {isExpanded ? "Hide price details" : "View price details"}
                    {isExpanded ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-4 rounded-[24px] bg-white p-4">
                      <h3 className="font-semibold text-[#476973]">
                        Price details
                      </h3>

                      <div className="mt-4 space-y-3">
                        {result.matchedItems.map((item, itemIndex) => (
                          <div
                            key={`${item.serviceCode}-${itemIndex}`}
                            className="rounded-2xl bg-[#F8FBFA] p-4"
                          >
                            <div className="flex justify-between gap-3">
                              <div>
                                <p className="font-semibold text-[#476973]">
                                  {item.originalName}
                                </p>
                                <p className="mt-1 text-xs text-[#476973]/60">
                                  Matched as: {item.serviceName}
                                </p>
                              </div>

                              <p className="font-bold text-[#476973]">
                                {item.totalPrice.toLocaleString()} SAR
                              </p>
                            </div>

                            <p className="mt-2 text-sm text-[#476973]/70">
                              {item.unitPrice.toLocaleString()} SAR ×{" "}
                              {item.quantity}
                            </p>
                          </div>
                        ))}
                      </div>

                      {result.unmatchedItems.length > 0 && (
                        <div className="mt-4 rounded-2xl bg-yellow-50 p-4">
                          <p className="font-semibold text-yellow-800">
                            Not matched
                          </p>

                          <ul className="mt-2 space-y-1 text-sm text-yellow-800">
                            {result.unmatchedItems.map((item, itemIndex) => (
                              <li key={`${item}-${itemIndex}`}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            <button
              onClick={() => router.push("/best-option")}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#476973] py-4 font-semibold text-white"
            >
              View Best Option
              <ArrowRight size={20} />
            </button>

            <button
              onClick={() => router.push("/review-plan")}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#476973] py-4 font-semibold text-[#476973]"
            >
              <ArrowLeft size={20} />
              Back to Review
            </button>
          </div>
        )}
      </section>

      <BottomNavigation />
    </main>
  );
}