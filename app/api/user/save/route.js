import User from "@/models/userSchema";
import connectToDb from "@/utils/database";

export async function PATCH(req) {
    try {
        await connectToDb();
        const { email, currentStats, daysSurvived, cardIndex } = await req.json();

        if (!email || currentStats === undefined || daysSurvived === undefined || cardIndex === undefined) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        const updatedUser = await User.findOneAndUpdate(
            { email },
            { currentStats, daysSurvived, cardIndex },
            { new: true, projection: "currentStats daysSurvived cardIndex" }
        );

        if (!updatedUser) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(updatedUser), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}
