import Link from "next/link";
import BottomNavigation from "@/shared/components/navigation/BottomNavigation";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#D4E0DF] flex flex-col">

      <header className="pt-12 text-center">

        <h1 className="text-4xl font-serif text-[#476973]">
          PreCare Pay
        </h1>

      </header>

      <section className="flex-1 flex items-center justify-center">

        <h2 className="text-3xl font-bold text-[#476973] text-center">
          Manage your
          <br />
          plans easily
        </h2>

      </section>

      <BottomNavigation />

    </main>
  );
}