import { NextResponse } from "next/server";
import { ensureDemoData } from "@/lib/demo-data";

export async function POST() {
    const { provider, user, slots, booking } = await ensureDemoData({ createBooking: true });

    return NextResponse.json({
        provider,
        user,
        slots,
        booking,
        message: "Seed data ready",
    });
}
