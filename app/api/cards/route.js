import Card from "@/models/cardSchema";
import connectToDb from "@/utils/database";

export async function GET() {
    try {
        await connectToDb();
        const cards = await Card.find(); 
        return new Response(JSON.stringify(cards), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function POST(req) {
  try {
    await connectToDb();
    const data = await req.json();
    
    const { title, imagePath, description, choices } = data;
    if (!title || !imagePath || !description || !choices) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }), 
        { status: 400 }
      );
    }
    
    const newCard = await Card.create(data);
    return new Response(JSON.stringify(newCard), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
