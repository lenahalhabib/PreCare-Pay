import type { ExtractedPlanItem } from "@/shared/context/TreatmentContext";
import type { SaveTreatmentPlanInput } from "@/services/plan/plan.types";

import {
  buildHospitalComparison,
} from "@/shared/utils/hospitalComparison";

export type ComparisonResult =
  ReturnType<
    typeof buildHospitalComparison
  >[number];

type BuildSavePlanInputParams = {
  extractedText: string;
  totalAmount: number;
  items: ExtractedPlanItem[];
  comparisonResults: ComparisonResult[];
};

export function createRecommendationReason(
  bestOption: ComparisonResult,
  totalItems: number
): string {
  const priceDifference = Math.abs(
    bestOption.savings
  );

  let priceMessage: string;

  if (bestOption.savings > 0) {
    priceMessage =
      `يوفر ${priceDifference.toLocaleString()} ريال ` +
      "مقارنة بالخطة الأصلية";
  } else if (bestOption.savings < 0) {
    priceMessage =
      `تكلفته أعلى من الخطة الأصلية بمقدار ` +
      `${priceDifference.toLocaleString()} ريال`;
  } else {
    priceMessage =
      "تكلفته مساوية لتكلفة الخطة الأصلية";
  }

  return (
    `نوصي بـ ${bestOption.hospital.name} لأنه حقق أعلى ` +
    `درجة توافق إجمالية بنسبة ${Math.round(
      bestOption.finalScore
    )}%. ` +
    `تمت مطابقة ${bestOption.matchedServices} من أصل ` +
    `${totalItems} خدمات علاجية، بنسبة اكتمال ` +
    `${Math.round(
      bestOption.completenessScore
    )}%. ` +
    `بلغت التكلفة التقديرية ` +
    `${bestOption.total.toLocaleString()} ريال، و${priceMessage}. ` +
    `كما بلغت نسبة توافق التأمين ` +
    `${Math.round(
      bestOption.insuranceCompatibility
    )}%، ويغطي التأمين مبلغًا تقديريًا قدره ` +
    `${Math.round(
      bestOption.insuranceCoveredAmount
    ).toLocaleString()} ريال، ` +
    `بينما يدفع المستخدم مبلغًا تقديريًا قدره ` +
    `${Math.round(
      bestOption.patientAmount
    ).toLocaleString()} ريال. ` +
    `كما حصل المستشفى على تقييم جودة بنسبة ` +
    `${Math.round(
      bestOption.qualityScore
    )}% وتقييم عملاء ` +
    `${bestOption.hospital.rating} من 5.`
  );
}

export function buildSaveTreatmentPlanInput({
  extractedText,
  totalAmount,
  items,
  comparisonResults,
}: BuildSavePlanInputParams): SaveTreatmentPlanInput {
  const bestOption =
    comparisonResults[0];

  if (!bestOption) {
    throw new Error(
      "Best hospital option is missing"
    );
  }

  const recommendationReason =
    createRecommendationReason(
      bestOption,
      items.length
    );

  return {
    title: `Treatment Plan - ${new Date().toLocaleDateString(
      "en-GB"
    )}`,

    originalFileName: null,

    extractedText,

    totalAmount: Number(
      totalAmount || 0
    ),

    items: items.map((item) => ({
      service_name: item.serviceName,

      quantity: Number(
        item.quantity || 1
      ),

      unit_price: Number(
        item.unitPrice || 0
      ),

      total_price: Number(
        item.totalPrice || 0
      ),
    })),

    hospitalResults:
      comparisonResults.map(
        (result, index) => ({
          hospital_id:
            result.hospital.id,

          hospital_name:
            result.hospital.name,

          location:
            result.hospital.location ??
            null,

          accreditation:
            result.hospital
              .accreditation ?? null,

          rating:
            result.hospital.rating ===
              null ||
            result.hospital.rating ===
              undefined
              ? null
              : Number(
                  result.hospital.rating
                ),

          guarantee_days:
            result.hospital
              .guarantee_days === null ||
            result.hospital
              .guarantee_days ===
              undefined
              ? null
              : Number(
                  result.hospital
                    .guarantee_days
                ),

          total_price: Number(
            result.total || 0
          ),

          savings: Number(
            result.savings || 0
          ),

          duration_days: Number(
            result.duration || 0
          ),

          matched_services_count:
            Number(
              result.matchedServices ||
                0
            ),

          total_services_count:
            items.length,

          score: Number(
            result.finalScore || 0
          ),

          ranking: index + 1,

          is_best_option:
            index === 0,

          recommendation_reason:
            index === 0
              ? recommendationReason
              : null,

          service_breakdown:
            result.matchedItems.map(
              (matchedItem) => ({
                service_name:
                  matchedItem.originalName,

                matched_service_name:
                  matchedItem.serviceName,

                quantity:
                  matchedItem.quantity,

                unit_price:
                  matchedItem.unitPrice,

                total_price:
                  matchedItem.totalPrice,

                matched: true,
              })
            ),

          score_breakdown: {
            treatment_completeness:
              Number(
                result.completenessScore ||
                  0
              ),

            cost_score: Number(
              result.costScore || 0
            ),

            quality_score: Number(
              result.qualityScore || 0
            ),

            insurance_compatibility:
              Number(
                result.insuranceCompatibility ||
                  0
              ),

            insurance_covered_amount:
              Number(
                result.insuranceCoveredAmount ||
                  0
              ),

            patient_amount: Number(
              result.patientAmount || 0
            ),

            treatment_completeness_weight:
              30,

            cost_weight: 25,

            quality_weight: 25,

            insurance_weight: 20,
          },
        })
      ),

    bestHospitalId:
      bestOption.hospital.id,

    bestHospitalName:
      bestOption.hospital.name,

    bestOptionReason:
      recommendationReason,

    analysisVersion: "v2",
  };
}