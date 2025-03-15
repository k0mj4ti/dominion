import Card from "@/models/cardSchema";
import connectToDb from "@/utils/database";


export async function GET(req, { params }) {
  try {
    await connectToDb();
    const { id } = params;
    const card = await Card.findById(id);
    if (!card) {
      return new Response(JSON.stringify({ error: "Card not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(card), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDb();
    const { id } = params;
    const data = await req.json();
    
    const { title, imagePath, description, choices } = data;
    if (!title || !imagePath || !description || !choices) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }), 
        { status: 400 }
      );
    }
    
    const updatedCard = await Card.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!updatedCard) {
      return new Response(JSON.stringify({ error: "Card not found" }), { status: 404 });
    }
    
    return new Response(JSON.stringify(updatedCard), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDb();
    const { id } = params;
    
    const deletedCard = await Card.findByIdAndDelete(id);
    
    if (!deletedCard) {
      return new Response(JSON.stringify({ error: "Card not found" }), { status: 404 });
    }
    
    return new Response(JSON.stringify({ message: "Card deleted successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
