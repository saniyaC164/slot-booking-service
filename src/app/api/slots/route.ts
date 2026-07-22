import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            providerId,
            startTime,
            endTime,
        } = body;

        const slot = await prisma.slot.create({
            data: {
                providerId,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
            },
        });

        return NextResponse.json(slot, { status: 201 });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to create slot" },
            { status: 500 }
        );
    }
}