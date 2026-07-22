import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const slot = await prisma.slot.findUnique({
        where: { id },
        include: {
            provider: { select: { id: true, name: true, email: true } },
            booking: true,
        },
    });

    if (!slot) {
        return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    return NextResponse.json(slot);
}
