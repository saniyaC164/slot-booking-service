import Link from "next/link";
import { ensureDemoData } from "@/lib/demo-data";

export default async function Home() {
  await ensureDemoData();

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center bg-slate-950 px-6 py-16 text-slate-100">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-black/40">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Slot booking service
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-white">
          Book appointments with timezone-aware slots.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          Providers publish availability, users book a slot once, and every booking is shown in the correct time zone.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/slots"
            className="rounded-full bg-sky-600 px-5 py-3 font-medium text-white transition hover:bg-sky-500"
          >
            Browse available slots
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-slate-700 bg-slate-800 px-5 py-3 font-medium text-slate-100 transition hover:bg-slate-700"
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
