import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { timezone: true },
    });

    const bookings = await prisma.booking.findMany({
        where: { userId: session.user.id },
        include: {
            slot: {
                include: {
                    provider: {
                        select: { id: true, name: true, email: true },
                    },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
        timezone: user?.timezone || "UTC",
        bookings,
    });
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { slotId } = body;

    if (!slotId) {
        return NextResponse.json({ error: "Missing slotId" }, { status: 400 });
    }

    try {
        const booking = await prisma.$transaction(async (tx) => {
            const slot = await tx.slot.findUnique({
                where: { id: slotId },
                include: { booking: true },
            });

            if (!slot) {
                throw new Error("SLOT_NOT_FOUND");
            }

            if (slot.booking) {
                throw new Error("SLOT_ALREADY_BOOKED");
            }

            return tx.booking.create({
                data: {
                    userId: session.user.id,
                    slotId,
                    status: "CONFIRMED",
                },
                include: {
                    slot: {
                        include: {
                            provider: {
                                select: { id: true, name: true, email: true },
                            },
                        },
                    },
                },
            });
        });

        return NextResponse.json(booking, { status: 201 });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return NextResponse.json({ error: "Slot already booked" }, { status: 409 });
        }

        if (error instanceof Error && error.message === "SLOT_NOT_FOUND") {
            return NextResponse.json({ error: "Slot not found" }, { status: 404 });
        }

        if (error instanceof Error && error.message === "SLOT_ALREADY_BOOKED") {
            return NextResponse.json({ error: "Slot already booked" }, { status: 409 });
        }

        console.error("Booking creation failed", error);
        return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
    }
}
