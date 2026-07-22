import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: "USER" | "PROVIDER";
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        role: "USER" | "PROVIDER";
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: "USER" | "PROVIDER";
    }
}
