import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { name, email, password, role, timezone } = body;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                timezone: timezone || "UTC",
            },
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
        );
    }
}