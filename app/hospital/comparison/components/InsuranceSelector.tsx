import type { InsuranceCompany } from "@/shared/utils/hospitalComparison";

type InsuranceSelectorProps = {
  companies: InsuranceCompany[];
  selectedCompanyId: string;
  onChange: (companyId: string) => void;
};

export default function InsuranceSelector({
  companies,
  selectedCompanyId,
  onChange,
}: InsuranceSelectorProps) {
  const selectedCompany =
    companies.find(
      (company) =>
        company.id === selectedCompanyId
    ) ?? null;

  if (companies.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 rounded-[30px] bg-[#F8FBFA] p-5 shadow-sm">
      <label
        htmlFor="insurance-company"
        className="font-serif text-2xl text-[#476973]"
      >
        Select Insurance
      </label>

      <p className="mt-2 text-sm leading-6 text-[#476973]/70">
        Select a demo insurance company to calculate
        the estimated coverage and your remaining
        payment.
      </p>

      <select
        id="insurance-company"
        value={selectedCompanyId}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-4 w-full rounded-2xl border-2 border-[#D4E0DF] bg-white px-4 py-4 font-semibold text-[#476973] outline-none focus:border-[#476973]"
      >
        {companies.map((company) => (
          <option
            key={company.id}
            value={company.id}
          >
            {company.name} —{" "}
            {formatPlanType(company.plan_type)}
          </option>
        ))}
      </select>

      {selectedCompany && (
        <p className="mt-3 text-sm text-[#476973]/65">
          Selected:{" "}
          <span className="font-semibold text-[#476973]">
            {selectedCompany.name} —{" "}
            {formatPlanType(
              selectedCompany.plan_type
            )}
          </span>
        </p>
      )}

      <p className="mt-3 text-xs leading-5 text-[#476973]/55">
        Insurance companies and coverage percentages
        are demo data used to demonstrate the
        prototype.
      </p>
    </div>
  );
}

function formatPlanType(planType: string) {
  return (
    planType.charAt(0).toUpperCase() +
    planType.slice(1).toLowerCase()
  );
}