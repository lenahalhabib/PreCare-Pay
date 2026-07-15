import type {
  ComparisonResult,
  InsuranceCompany,
  InsuranceCoverage,
  MatchedItem,
} from "./hospitalComparison";

export const SCORE_WEIGHTS = {
  completeness: 1 / 3,
  cost: 1 / 3,
  rating: 1 / 3,
} as const;

export const SCORE_WEIGHT_PERCENTAGES = {
  completeness: 33.33,
  cost: 33.33,
  rating: 33.33,
} as const;

export type InsuranceOption = {
  companyId: string;
  companyCode: string;
  companyName: string;

  planType:
    | "BASIC"
    | "PLUS"
    | "PREMIUM";

  compatibilityPercentage: number;
  coveredAmount: number;
  patientAmount: number;
};

function toValidNumber(
  value: unknown
): number {
  const numericValue = Number(value);

  return Number.isFinite(numericValue)
    ? numericValue
    : 0;
}

function clampScore(
  value: number
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(0, value)
  );
}

function roundScore(
  value: number
): number {
  return Math.round(value * 100) / 100;
}

function calculateMatchedItemsTotal(
  matchedItems: MatchedItem[]
): number {
  return matchedItems.reduce(
    (total, item) =>
      total +
      toValidNumber(item.totalPrice),
    0
  );
}

export function calculateCompletenessScore(
  matchedServices: number,
  totalServices: number
): number {
  const matched =
    toValidNumber(matchedServices);

  const total =
    toValidNumber(totalServices);

  if (total <= 0) {
    return 0;
  }

  const score =
    (matched / total) * 100;

  return roundScore(
    clampScore(score)
  );
}


export function calculateCostScores(
  results: ComparisonResult[]
): Map<string, number> {
  const scores =
    new Map<string, number>();

  const validCosts =
    results
      .map((result) =>
        toValidNumber(
          result.comparisonCost
        )
      )
      .filter((cost) => cost > 0);

  if (validCosts.length === 0) {
    return scores;
  }

  const lowestCost =
    Math.min(...validCosts);

  results.forEach((result) => {
    const hospitalCost =
      toValidNumber(
        result.comparisonCost
      );

    if (
      hospitalCost <= 0 ||
      lowestCost <= 0
    ) {
      scores.set(
        result.hospital.id,
        0
      );

      return;
    }

    const score =
      (lowestCost / hospitalCost) *
      100;

    scores.set(
      result.hospital.id,
      roundScore(
        clampScore(score)
      )
    );
  });

  return scores;
}


export function calculateQualityScore(
  rating: number
): number {
  const normalizedRating =
    toValidNumber(rating);

  const score =
    (normalizedRating / 5) * 100;

  return roundScore(
    clampScore(score)
  );
}


export function calculateFinalScore(
  params: {
    completenessScore: number;
    costScore: number;
    qualityScore: number;
  }
): number {
  const {
    completenessScore,
    costScore,
    qualityScore,
  } = params;

  const finalScore =
    completenessScore *
      SCORE_WEIGHTS.completeness +
    costScore *
      SCORE_WEIGHTS.cost +
    qualityScore *
      SCORE_WEIGHTS.rating;

  return roundScore(
    clampScore(finalScore)
  );
}

export function calculateInsuranceDetails(
  params: {
    matchedItems: MatchedItem[];

    insuranceCoverage:
      InsuranceCoverage[];

    insuranceCompanyId:
      string | null;
  }
) {
  const {
    matchedItems,
    insuranceCoverage,
    insuranceCompanyId,
  } = params;

  const totalTreatmentCost =
    calculateMatchedItemsTotal(
      matchedItems
    );

  if (!insuranceCompanyId) {
    return {
      insuranceCompatibility: 0,
      insuranceCoveredAmount: 0,
      patientAmount:
        roundScore(
          totalTreatmentCost
        ),
    };
  }

  const companyCoverage =
    insuranceCoverage.filter(
      (coverage) =>
        coverage
          .insurance_company_id ===
        insuranceCompanyId
    );

  const insuranceCoveredAmount =
    matchedItems.reduce(
      (total, item) => {
        const itemCoverage =
          companyCoverage.find(
            (coverage) =>
              coverage.category ===
              item.category
          );

        const coveragePercentage =
          toValidNumber(
            itemCoverage
              ?.coverage_percentage
          );

        const itemTotal =
          toValidNumber(
            item.totalPrice
          );

        const coveredAmount =
          itemTotal *
          (coveragePercentage / 100);

        return total + coveredAmount;
      },
      0
    );

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
    insuranceCompatibility:
      roundScore(
        clampScore(
          insuranceCompatibility
        )
      ),

    insuranceCoveredAmount:
      roundScore(
        Math.max(
          0,
          insuranceCoveredAmount
        )
      ),

    patientAmount:
      roundScore(
        Math.max(
          0,
          patientAmount
        )
      ),
  };
}

export function calculateInsuranceOptions(
  params: {
    matchedItems: MatchedItem[];

    insuranceCompanies:
      InsuranceCompany[];

    insuranceCoverage:
      InsuranceCoverage[];
  }
): InsuranceOption[] {
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
        companyId:
          company.id,

        companyCode:
          company.company_code,

        companyName:
          company.name,

        planType:
          company.plan_type,

        compatibilityPercentage:
          details
            .insuranceCompatibility,

        coveredAmount:
          details
            .insuranceCoveredAmount,

        patientAmount:
          details.patientAmount,
      };
    })
    .sort(
      (
        firstOption,
        secondOption
      ) =>
        getPlanOrder(
          firstOption.planType
        ) -
        getPlanOrder(
          secondOption.planType
        )
    );
}

function getPlanOrder(
  planType:
    InsuranceOption["planType"]
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