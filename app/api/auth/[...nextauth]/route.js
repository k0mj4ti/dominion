import User from "@/models/userSchema";
import connectToDb from "@/utils/database";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

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
            async authorize(credentials) {
                const { email, password } = credentials;

                try {
                    await connectToDb();
                    const user = await User.findOne({ email }).lean();

                    if (!user) throw new Error("No user found with this email");
                    const passwordMatch = await bcrypt.compare(password, user.password);
                    if (!passwordMatch) throw new Error("Invalid password.");

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        username: user.username,
                        currentStats: user.currentStats,
                        daysSurvived: user.daysSurvived,
                    };
                } catch (error) {
                    throw error;
                }
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
                }
            } catch (error) {
                console.error("Session callback error:", error);
            }

            return session;
        },

        async signIn({ account, profile, credentials }) {

            if (account?.provider === "credentials") {
                try {
                    await connectToDb();
                    const user = await User.findOne({ email: credentials.email });

                    const passwordMatch = await bcrypt.compare(credentials.password, user.password);
                    return passwordMatch;
                } catch (error) {
                    return false;
                }
            }
        },

        async redirect({ url, baseUrl }) {
            try {
                const urlObject = new URL(url, baseUrl);
                return urlObject.origin === baseUrl || urlObject.pathname.startsWith('/') ? urlObject.href : `${baseUrl}/`;
            } catch (error) {
                console.error("Redirect callback error:", error);
                return `${baseUrl}/`;
            }
        },
    },
};

// 🚀 Move NextAuth to **Edge Runtime** for faster execution & no cold starts
export const config = { runtime: "edge" };

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
