import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { action } = body;

    const booking = await prisma.booking.findUnique({
        where: { id },
        include: { slot: true },
    });

    if (!booking) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.userId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (action === "cancel") {
        const updated = await prisma.booking.update({
            where: { id },
            data: { status: "CANCELLED" },
        });
        return NextResponse.json(updated);
    }

    if (action === "reschedule") {
        const { newSlotId } = body;

        if (!newSlotId) {
            return NextResponse.json({ error: "Missing newSlotId" }, { status: 400 });
        }

        try {
            const updated = await prisma.$transaction(async (tx) => {
                const targetSlot = await tx.slot.findUnique({
                    where: { id: newSlotId },
                    include: { booking: true },
                });

                if (!targetSlot || targetSlot.booking) {
                    throw new Error("TARGET_SLOT_UNAVAILABLE");
                }

                await tx.booking.update({
                    where: { id },
                    data: { status: "CANCELLED" },
                });

                return tx.booking.create({
                    data: {
                        userId: session.user.id,
                        slotId: newSlotId,
                        status: "CONFIRMED",
                    },
                });
            });

            return NextResponse.json(updated);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
                return NextResponse.json({ error: "Target slot is unavailable" }, { status: 409 });
            }

            if (error instanceof Error && error.message === "TARGET_SLOT_UNAVAILABLE") {
                return NextResponse.json({ error: "Target slot is unavailable" }, { status: 409 });
            }

            console.error("Reschedule failed", error);
            return NextResponse.json({ error: "Failed to reschedule booking" }, { status: 500 });
        }
    }

    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}
