import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const slots = await prisma.slot.findMany({
            where: {
                booking: null,
            },
            include: {
                provider: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        timezone: true,
                    },
                },
            },
            orderBy: {
                startTime: "asc",
            },
        });

        return NextResponse.json(slots);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { providerId, startTime, endTime } = body;

        if (!providerId || !startTime || !endTime) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const parsedStart = new Date(startTime);
        const parsedEnd = new Date(endTime);

        if (Number.isNaN(parsedStart.getTime()) || Number.isNaN(parsedEnd.getTime())) {
            return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
        }

        if (parsedEnd <= parsedStart) {
            return NextResponse.json({ error: "End time must be after start time" }, { status: 400 });
        }

        const slot = await prisma.slot.create({
            data: {
                providerId,
                startTime: parsedStart,
                endTime: parsedEnd,
            },
        });

        return NextResponse.json(slot, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create slot" }, { status: 500 });
    }
}