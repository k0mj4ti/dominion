import { NextResponse } from "next/server";

export async function POST() {
    try {
        return NextResponse.json(
            { message: "Signed out successfully" },
            {
                status: 200,
                headers: {
                    "Set-Cookie": "token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0",
                },
            }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
