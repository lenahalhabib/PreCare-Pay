import Link from "next/link";

export default function SplashPage() {
  return (
    <main className="min-h-screen bg-[#D4E0DF] flex flex-col items-center justify-center px-8">
      <h1 className="text-5xl font-serif text-[#476973]">
        PreCare Pay
      </h1>

      <p className="mt-6 max-w-sm text-center text-sm font-semibold tracking-[0.2em] text-[#476973]">
        FROM A TREATMENT PLAN
        <br />
        TO A CLEAR FINANCIAL DECISION
      </p>

      <Link
        href="/login"
        className="mt-16 w-full max-w-xs rounded-2xl bg-[#476973] py-4 text-center font-semibold text-white"
      >
        LOGIN
      </Link>

      <p className="mt-6 text-[#476973]">
        If you don&apos;t have an account
      </p>

      <Link href="/signup" className="mt-1 font-bold text-[#476973]">
        Sign Up
      </Link>
    </main>
  );
}