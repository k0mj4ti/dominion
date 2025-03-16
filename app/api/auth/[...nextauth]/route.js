import User from "@/models/userSchema";
import connectToDb from "@/utils/database";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";

async function generateJwtToken(user) {
    return jwt.sign(
        {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
        },
        process.env.NEXTAUTH_SECRET,
        { expiresIn: "1h" }
    );
}

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},
            async authorize(credentials, req) {
                const { email, password } = credentials;

                await connectToDb();
                const user = await User.findOne({ email }).lean();
                if (!user) throw new Error("No user found with this email");

                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) throw new Error("Invalid password.");

                return user;
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/login",
    },
    callbacks: {
        async session({ session, token }) {
            if (!token?.email) return session;

            try {
                await connectToDb();
                const sessionUser = await User.findOne({ email: token.email })
                    .select("username currentStats daysSurvived")
                    .lean();

                if (sessionUser) {
                    session.user.id = sessionUser._id.toString();
                    session.user.email = token.email;
                    session.user.username = sessionUser.username;
                    session.user.currentStats = sessionUser.currentStats;
                    session.user.daysSurvived = sessionUser.daysSurvived;
                    session.user.accessToken = token.accessToken; // Token visszaadása
                }
            } catch (error) {
                console.error("Session callback error:", error);
            }

            return session;
        },

        async signIn({ user, account, credentials, req }) {
            if (req.query.redirect_uri) {
                // Ha WPF-ből jön a kérés, generáljunk egy token-t
                user.accessToken = randomUUID();
            }
            return true;
        },

        async redirect({ url, baseUrl }) {
            if (url.includes("redirect_uri")) {
                return url;
            }
            return baseUrl;
        },
    },
};

// 🚀 Move NextAuth to **Edge Runtime** for faster execution & no cold starts
export const config = { runtime: "edge" };

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };