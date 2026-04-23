import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mysql", 
    }),

    //baseURL: process.env.BETTER_AUTH_URL!,
    //secret: process.env.BETTER_AUTH_SECRET!,

    emailAndPassword: {
        enabled: true,
    },

    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
            },
        },
    },
    plugins: [nextCookies()],
    
});