import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";


import connectToDb from "@/utils/database";
import User from "@/models/userSchema";

const SECRET_KEY = process.env.JWT_SECRET || "supersecret";

export async function GET(req) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, SECRET_KEY);

        await connectToDb();
        const user = await User.findById(decoded.id).select("-password");

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}
