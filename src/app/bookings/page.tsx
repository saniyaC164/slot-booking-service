"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDateTime } from "@/lib/time";

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [userTimezone, setUserTimezone] = useState("UTC");
    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [reschedulingId, setReschedulingId] = useState<string | null>(null);

    async function loadBookings() {
        setLoading(true);
        const [bookingsRes, slotsRes] = await Promise.all([
            fetch("/api/bookings"),
            fetch("/api/slots"),
        ]);

        const bookingsPayload = await bookingsRes.json();
        const slotsData = await slotsRes.json();
        setBookings(bookingsPayload.bookings || []);
        setUserTimezone(bookingsPayload.timezone || "UTC");
        setAvailableSlots(slotsData);
        setLoading(false);
    }

    useEffect(() => {
        void loadBookings();
    }, []);

    async function cancelBooking(id: string) {
        const res = await fetch(`/api/bookings/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "cancel" }),
        });

        if (res.ok) {
            setMessage("Booking cancelled.");
            await loadBookings();
        } else {
            const error = await res.json();
            setMessage(error.error || "Unable to cancel booking.");
        }
    }

    async function rescheduleBooking(id: string, newSlotId: string) {
        const res = await fetch(`/api/bookings/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "reschedule", newSlotId }),
        });

        if (res.ok) {
            setMessage("Booking rescheduled.");
            setReschedulingId(null);
            await loadBookings();
        } else {
            const error = await res.json();
            setMessage(error.error || "Unable to reschedule booking.");
        }
    }

    return (
        <main className="mx-auto max-w-5xl px-6 py-12">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">My bookings</p>
                    <h1 className="text-3xl font-semibold text-slate-900">Your appointments</h1>
                </div>
                <Link href="/slots" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                    Browse slots
                </Link>
            </div>

            {message ? <p className="mb-4 text-sm text-emerald-600">{message}</p> : null}

            {loading ? (
                <p className="text-slate-600">Loading your bookings…</p>
            ) : bookings.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
                    You have no bookings yet.
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <p className="font-semibold text-slate-900">{booking.slot.provider.name}</p>
                                    <p className="text-sm text-slate-600">
                                        {formatDateTime(booking.slot.startTime, userTimezone)} – {formatDateTime(booking.slot.endTime, userTimezone)}
                                    </p>
                                </div>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                                    {booking.status}
                                </span>
                            </div>

                            {booking.status === "CONFIRMED" ? (
                                <div className="mt-4 flex flex-wrap gap-3">
                                    <button
                                        onClick={() => void cancelBooking(booking.id)}
                                        className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
                                    >
                                        Cancel booking
                                    </button>
                                    <button
                                        onClick={() => setReschedulingId(booking.id)}
                                        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        Reschedule
                                    </button>
                                </div>
                            ) : null}

                            {reschedulingId === booking.id ? (
                                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="mb-3 text-sm font-medium text-slate-700">Choose another available slot</p>
                                    <div className="space-y-2">
                                        {availableSlots.length === 0 ? (
                                            <p className="text-sm text-slate-600">No other slots are currently available.</p>
                                        ) : (
                                            availableSlots.map((slot) => (
                                                <button
                                                    key={slot.id}
                                                    onClick={() => void rescheduleBooking(booking.id, slot.id)}
                                                    className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                                                >
                                                    <span>
                                                        {slot.provider?.name || "Provider"} • {formatDateTime(slot.startTime, userTimezone)}
                                                    </span>
                                                    <span className="text-slate-500">Select</span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setReschedulingId(null)}
                                        className="mt-3 text-sm font-medium text-slate-500 hover:text-slate-700"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
