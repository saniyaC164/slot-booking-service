import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


// GET /api/slots
export async function GET() {
    try {
        const slots = await prisma.slot.findMany({
            where: {
                isBooked: false,
            },
            include: {
                provider: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
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

        return NextResponse.json(
            { error: "Failed to fetch slots" },
            { status: 500 }
        );
    }
}


// POST /api/slots
export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            providerId,
            startTime,
            endTime,
        } = body;

        if (!providerId || !startTime || !endTime) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

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