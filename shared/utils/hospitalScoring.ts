import type {
  ComparisonResult,
  InsuranceCompany,
  InsuranceCoverage,
  MatchedItem,
} from "./hospitalComparison";

const SCORE_WEIGHTS = {
  completeness: 0.3,
  cost: 0.25,
  quality: 0.25,
  insurance: 0.2,
} as const;

export type InsuranceOption = {
  companyId: string;
  companyCode: string;
  companyName: string;
  planType: "BASIC" | "PLUS" | "PREMIUM";

  compatibilityPercentage: number;
  coveredAmount: number;
  patientAmount: number;
};

function clampScore(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
}

function roundScore(value: number): number {
  return Math.round(value * 100) / 100;
}

function calculateMatchedItemsTotal(
  matchedItems: MatchedItem[]
): number {
  return matchedItems.reduce(
    (total, item) =>
      total + Number(item.totalPrice || 0),
    0
  );
}

export function calculateCompletenessScore(
  matchedServices: number,
  totalServices: number
): number {
  if (totalServices <= 0) {
    return 0;
  }

  return roundScore(
    clampScore(
      (matchedServices / totalServices) * 100
    )
  );
}

export function calculateCostScores(
  results: ComparisonResult[]
): Map<string, number> {
  const validTotals = results
    .map((result) => Number(result.total || 0))
    .filter((total) => total > 0);

  const lowestTotal =
    validTotals.length > 0
      ? Math.min(...validTotals)
      : 0;

  const scores = new Map<string, number>();

  results.forEach((result) => {
    const hospitalTotal = Number(
      result.total || 0
    );

    if (
      lowestTotal <= 0 ||
      hospitalTotal <= 0
    ) {
      scores.set(result.hospital.id, 0);
      return;
    }

    const score =
      (lowestTotal / hospitalTotal) * 100;

    scores.set(
      result.hospital.id,
      roundScore(clampScore(score))
    );
  });

  return scores;
}

export function calculateQualityScore(
  rating: number
): number {
  const normalizedRating = Number(
    rating || 0
  );

  return roundScore(
    clampScore(
      (normalizedRating / 5) * 100
    )
  );
}

export function calculateInsuranceDetails(params: {
  matchedItems: MatchedItem[];
  insuranceCoverage: InsuranceCoverage[];
  insuranceCompanyId: string | null;
}) {
  const {
    matchedItems,
    insuranceCoverage,
    insuranceCompanyId,
  } = params;

  const totalTreatmentCost =
    calculateMatchedItemsTotal(matchedItems);

  if (!insuranceCompanyId) {
    return {
      insuranceCompatibility: 0,
      insuranceCoveredAmount: 0,
      patientAmount: roundScore(
        totalTreatmentCost
      ),
    };
  }

  const companyCoverage =
    insuranceCoverage.filter(
      (coverage) =>
        coverage.insurance_company_id ===
        insuranceCompanyId
    );

  const insuranceCoveredAmount =
    matchedItems.reduce((total, item) => {
      const itemCoverage =
        companyCoverage.find(
          (coverage) =>
            coverage.category ===
            item.category
        );

      const coveragePercentage =
        Number(
          itemCoverage?.coverage_percentage ??
            0
        );

      const coveredAmount =
        Number(item.totalPrice || 0) *
        (coveragePercentage / 100);

      return total + coveredAmount;
    }, 0);

  const insuranceCompatibility =
    totalTreatmentCost > 0
      ? (insuranceCoveredAmount /
          totalTreatmentCost) *
        100
      : 0;

  const patientAmount =
    totalTreatmentCost -
    insuranceCoveredAmount;

  return {
    insuranceCompatibility: roundScore(
      clampScore(insuranceCompatibility)
    ),

    insuranceCoveredAmount: roundScore(
      Math.max(
        0,
        insuranceCoveredAmount
      )
    ),

    patientAmount: roundScore(
      Math.max(0, patientAmount)
    ),
  };
}

export function calculateInsuranceOptions(params: {
  matchedItems: MatchedItem[];
  insuranceCompanies: InsuranceCompany[];
  insuranceCoverage: InsuranceCoverage[];
}): InsuranceOption[] {
  const {
    matchedItems,
    insuranceCompanies,
    insuranceCoverage,
  } = params;

  return insuranceCompanies
    .map((company) => {
      const details =
        calculateInsuranceDetails({
          matchedItems,
          insuranceCoverage,
          insuranceCompanyId:
            company.id,
        });

      return {
        companyId: company.id,
        companyCode:
          company.company_code,
        companyName: company.name,
        planType: company.plan_type,

        compatibilityPercentage:
          details.insuranceCompatibility,

        coveredAmount:
          details.insuranceCoveredAmount,

        patientAmount:
          details.patientAmount,
      };
    })
    .sort(
      (firstOption, secondOption) =>
        getPlanOrder(
          firstOption.planType
        ) -
        getPlanOrder(
          secondOption.planType
        )
    );
}

export function calculateFinalScore(params: {
  completenessScore: number;
  costScore: number;
  qualityScore: number;
  insuranceCompatibility: number;
}): number {
  const {
    completenessScore,
    costScore,
    qualityScore,
    insuranceCompatibility,
  } = params;

  const finalScore =
    completenessScore *
      SCORE_WEIGHTS.completeness +
    costScore *
      SCORE_WEIGHTS.cost +
    qualityScore *
      SCORE_WEIGHTS.quality +
    insuranceCompatibility *
      SCORE_WEIGHTS.insurance;

  return roundScore(
    clampScore(finalScore)
  );
}

function getPlanOrder(
  planType: InsuranceOption["planType"]
): number {
  switch (planType) {
    case "BASIC":
      return 1;

    case "PLUS":
      return 2;

    case "PREMIUM":
      return 3;

    default:
      return 99;
  }
}