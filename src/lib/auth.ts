import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-me",
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                timezone: { label: "Timezone", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const normalizedEmail = credentials.email.toLowerCase();
                const demoPassword = "password123";

                let user = await prisma.user.findUnique({
                    where: { email: normalizedEmail },
                });

                if (!user && (normalizedEmail === "user@example.com" || normalizedEmail === "provider@example.com")) {
                    const hashedPassword = await bcrypt.hash(demoPassword, 10);
                    user = await prisma.user.create({
                        data: {
                            name: normalizedEmail === "provider@example.com" ? "Dr. Maya Patel" : "Alex Rivera",
                            email: normalizedEmail,
                            password: hashedPassword,
                            role: normalizedEmail === "provider@example.com" ? "PROVIDER" : "USER",
                            timezone: "UTC",
                        },
                    });
                }

                if (!user) {
                    return null;
                }

                const validPassword = await bcrypt.compare(credentials.password, user.password);

                if (!validPassword) {
                    return null;
                }

                const timezone = typeof credentials.timezone === "string" ? credentials.timezone : "UTC";

                await prisma.user.update({
                    where: { id: user.id },
                    data: { timezone },
                });

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }

            if (!token.id && token.sub) {
                token.id = token.sub;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = (token.id ?? token.sub ?? "") as string;
                session.user.role = (token.role as "USER" | "PROVIDER") ?? "USER";
            }

            return session;
        },
    },
};