"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function ProviderPage() {
    const { data: session, status } = useSession();

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [message, setMessage] = useState("");

    async function createSlot() {
        const providerId = session?.user?.id;

        if (!providerId) {
            setMessage("Please sign in first.");
            return;
        }

        const res = await fetch("/api/slots", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ providerId, startTime, endTime }),
        });

        if (res.ok) {
            setMessage("Slot created successfully.");
            setStartTime("");
            setEndTime("");
        } else {
            const error = await res.json();
            setMessage(error.error || "Failed to create slot");
        }
    }

    return (
        <main className="mx-auto max-w-3xl px-6 py-12">
            <h1 className="text-3xl font-semibold text-slate-900">Provider dashboard</h1>
            <p className="mt-2 text-slate-600">Status: {status}</p>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Create a new slot</h2>
                {message ? <p className="mt-3 text-sm text-emerald-600">{message}</p> : null}
                <div className="mt-4 space-y-4">
                    <label className="block text-sm font-medium text-slate-700">
                        Start time
                        <input
                            type="datetime-local"
                            value={startTime}
                            onChange={(event) => setStartTime(event.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                        />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                        End time
                        <input
                            type="datetime-local"
                            value={endTime}
                            onChange={(event) => setEndTime(event.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                        />
                    </label>
                    <button
                        onClick={() => void createSlot()}
                        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                    >
                        Create slot
                    </button>
                </div>
            </div>
        </main>
    );
}