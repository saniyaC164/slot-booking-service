"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatDateTime } from "@/lib/time";

export default function SlotsPage() {
    const [slots, setSlots] = useState<any[]>([]);
    const [userTimezone, setUserTimezone] = useState("UTC");
    const [page, setPage] = useState(1);
    const [providerFilter, setProviderFilter] = useState("");
    const [message, setMessage] = useState("");
    const pageSize = 3;

    async function loadSlots() {
        const [slotsRes, bookingsRes] = await Promise.all([
            fetch("/api/slots"),
            fetch("/api/bookings"),
        ]);

        const slotsData = await slotsRes.json();
        const bookingsData = await bookingsRes.json();
        setSlots(slotsData);
        setUserTimezone(bookingsData.timezone || "UTC");
    }

    useEffect(() => {
        void loadSlots();
    }, []);

    const filteredSlots = useMemo(() => {
        const normalizedFilter = providerFilter.trim().toLowerCase();

        return slots.filter((slot) => {
            const providerName = slot.provider?.name?.toLowerCase() || "";
            return normalizedFilter.length === 0 || providerName.includes(normalizedFilter);
        });
    }, [providerFilter, slots]);

    const totalPages = Math.max(1, Math.ceil(filteredSlots.length / pageSize));
    const visibleSlots = filteredSlots.slice((page - 1) * pageSize, page * pageSize);

    useEffect(() => {
        setPage(1);
    }, [providerFilter]);

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    async function bookSlot(slotId: string) {
        const res = await fetch("/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slotId }),
        });

        const data = await res.json();
        if (res.ok) {
            setMessage(`Booked successfully with ${data.slot.provider.name}.`);
            await loadSlots();
        } else {
            setMessage(data.error || "Unable to book slot.");
        }
    }

    return (
        <main className="mx-auto max-w-5xl px-6 py-12">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Available slots</p>
                    <h1 className="text-3xl font-semibold text-slate-900">Pick an appointment</h1>
                </div>
                <Link href="/bookings" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                    My bookings
                </Link>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-3">
                <input
                    value={providerFilter}
                    onChange={(event) => setProviderFilter(event.target.value)}
                    placeholder="Filter by provider"
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm"
                />
                <p className="text-sm text-slate-500">
                    Showing {filteredSlots.length} slot{filteredSlots.length === 1 ? "" : "s"}
                </p>
            </div>

            {message ? <p className="mb-4 text-sm text-emerald-600">{message}</p> : null}

            {visibleSlots.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
                    No slots match your current filters.
                </div>
            ) : (
                <div className="space-y-4">
                    {visibleSlots.map((slot) => (
                        <div key={slot.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <p className="font-semibold text-slate-900">{slot.provider?.name}</p>
                                    <p className="text-sm text-slate-600">
                                        {formatDateTime(slot.startTime, userTimezone)} – {formatDateTime(slot.endTime, userTimezone)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => void bookSlot(slot.id)}
                                    className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                                >
                                    Book slot
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-6 flex items-center justify-between">
                <button
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page === 1}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Previous
                </button>
                <p className="text-sm text-slate-600">
                    Page {page} of {totalPages}
                </p>
                <button
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    disabled={page === totalPages}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </main>
    );
}