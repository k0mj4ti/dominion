import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "@/models/userSchema";
import connectToDb from "@/utils/database";

const SECRET_KEY = process.env.JWT_SECRET || "supersecret"; // Cseréld ki erős kulcsra és használd `.env` fájlban!

export async function POST(req) {
    try {
        const { email, password } = await req.json();
        await connectToDb(); // Adatbázis csatlakozás

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // JWT generálás
        const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: "7d" });

        return NextResponse.json({ token });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
