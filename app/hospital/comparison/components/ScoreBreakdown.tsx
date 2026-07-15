import type { ComparisonResult } from "@/shared/utils/hospitalComparison";

type ScoreBreakdownProps = {
  result: ComparisonResult;
};

export default function ScoreBreakdown({
  result,
}: ScoreBreakdownProps) {
  return (
    <div>
      <h3 className="font-serif text-xl text-[#476973]">
        Score Breakdown
      </h3>

      <div className="mt-4 space-y-3">
        <ScoreRow
          label="Treatment Completeness"
          score={result.completenessScore}
          weight="30%"
        />

        <ScoreRow
          label="Cost Score"
          score={result.costScore}
          weight="25%"
        />

        <ScoreRow
          label="Quality Score"
          score={result.qualityScore}
          weight="25%"
        />

        <ScoreRow
          label="Insurance Compatibility"
          score={result.insuranceCompatibility}
          weight="20%"
        />
      </div>
    </div>
  );
}

function ScoreRow({
  label,
  score,
  weight,
}: {
  label: string;
  score: number;
  weight: string;
}) {
  const safeScore = Math.min(
    100,
    Math.max(0, Number(score || 0))
  );

  return (
    <div className="rounded-2xl bg-[#F8FBFA] p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-[#476973]">
            {label}
          </p>

          <p className="mt-1 text-xs text-[#476973]/60">
            Weight: {weight}
          </p>
        </div>

        <p className="font-bold text-[#476973]">
          {Math.round(safeScore)}%
        </p>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#D4E0DF]">
        <div
          className="h-full rounded-full bg-[#476973]"
          style={{
            width: `${safeScore}%`,
          }}
        />
      </div>
    </div>
  );
}