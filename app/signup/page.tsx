import Link from "next/link";
export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#D4E0DF] flex flex-col justify-center items-center px-8">

      <h1 className="text-5xl font-serif text-[#476973]">
        Login
      </h1>

      <div className="mt-12 w-full max-w-sm space-y-5">

        <input
          type="text"
          placeholder="Name"
          className="w-full rounded-2xl bg-white p-4 outline-none"
        />

        <input
          type="text"
          placeholder="ID"
          className="w-full rounded-2xl bg-white p-4 outline-none"
        />

        <input
          type="text"
          placeholder="Email"
          className="w-full rounded-2xl bg-white p-4 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-2xl bg-white p-4 outline-none"
        />

     <button
  className="w-full rounded-2xl bg-[#476973] py-4 text-white font-semibold"
>
  SIGNUP
</button>

    <p className="mt-6 text-center text-[#476973]">
  Already have an account?{" "}
  <Link href="/login" className="font-bold">
    Login
  </Link>
</p>

      </div>

    </main>
  );
}