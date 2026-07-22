"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getTimezones } from "@/lib/timezones";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [timezone, setTimezone] = useState("UTC");
    const [timezones, setTimezones] = useState<string[]>([]);

    useEffect(() => {
        setTimezones(getTimezones());
        const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (browserTimezone) {
            setTimezone(browserTimezone);
        }
    }, []);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        const result = await signIn("credentials", {
            email,
            password,
            timezone,
            redirect: false,
        });

        if (result?.ok) {
            router.push("/slots");
        } else {
            alert("Invalid credentials");
        }
    }

    return (
        <main className="mx-auto flex min-h-screen max-w-2xl items-center justify-center bg-slate-950 px-6 py-16 text-slate-100">
            <div className="w-full rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl shadow-black/40">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Sign in</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Welcome back</h1>
                <p className="mt-2 text-slate-300">Use your demo account or register a new one to continue.</p>

                <form onSubmit={handleLogin} className="mt-6 space-y-4">
                    <input
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-400"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-400"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <label className="block text-sm font-medium text-slate-300">
                        Timezone
                        <select
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                        >
                            {timezones.map((tz) => (
                                <option key={tz} value={tz}>
                                    {tz}
                                </option>
                            ))}
                        </select>
                    </label>

                    <button type="submit" className="w-full rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-500">
                        Login
                    </button>
                </form>
            </div>
        </main>
    );
}