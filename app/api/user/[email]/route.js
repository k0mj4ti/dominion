import User from "@/models/userSchema";
import connectToDb from "@/utils/database";

export async function GET(req, {params}) {
    try {
        await connectToDb();
        const { email } = await params;
        
        if (!email) {
            return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
        }

        const user = await User.findOne({ email }, "currentStats daysSurvived cardIndex");
        
        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
} 