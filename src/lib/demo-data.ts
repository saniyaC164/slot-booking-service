import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function ensureDemoData({ createBooking = false }: { createBooking?: boolean } = {}) {
    const hashedPassword = await bcrypt.hash("password123", 10);

    const provider = await prisma.user.upsert({
        where: { email: "provider@example.com" },
        update: {},
        create: {
            name: "Dr. Maya Patel",
            email: "provider@example.com",
            password: hashedPassword,
            role: "PROVIDER",
            timezone: "America/New_York",
        },
    });

    const user = await prisma.user.upsert({
        where: { email: "user@example.com" },
        update: {},
        create: {
            name: "Alex Rivera",
            email: "user@example.com",
            password: hashedPassword,
            role: "USER",
            timezone: "Europe/London",
        },
    });

    let slots = await prisma.slot.findMany({
        where: { providerId: provider.id },
        orderBy: { startTime: "asc" },
    });

    if (slots.length === 0) {
        const today = new Date();
        const slotOne = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 10, 0, 0);
        const slotTwo = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 14, 0, 0);
        const slotThree = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 9, 0, 0);

        await prisma.slot.createMany({
            data: [
                { providerId: provider.id, startTime: slotOne, endTime: new Date(slotOne.getTime() + 60 * 60 * 1000) },
                { providerId: provider.id, startTime: slotTwo, endTime: new Date(slotTwo.getTime() + 60 * 60 * 1000) },
                { providerId: provider.id, startTime: slotThree, endTime: new Date(slotThree.getTime() + 60 * 60 * 1000) },
            ],
        });

        slots = await prisma.slot.findMany({
            where: { providerId: provider.id },
            orderBy: { startTime: "asc" },
        });
    }

    let booking = null;
    if (createBooking) {
        const existingBooking = await prisma.booking.findFirst({ where: { userId: user.id } });
        if (!existingBooking && slots.length > 0) {
            booking = await prisma.booking.create({
                data: {
                    userId: user.id,
                    slotId: slots[0].id,
                },
            });
        }
    }

    return { provider, user, slots, booking };
}
