import User from "@/models/userSchema";
import connectToDb from "@/utils/database";


const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};

const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
};

export async function POST(request) {
    try {
        const {email, username, password} = await request.json();
        if (email.length === 0) return new Response("Email is empty", {status: 400});
        if (username.length === 0) return new Response("Username is empty", {status: 400});
        if (password.length === 0) return new Response("Password is empty", {status: 400});
        
        if (!validateEmail(email)) {
            return new Response("This email is not valid!", {status: 400})
        }
   
        if (!validatePassword(password)) {
            return new Response("Password must be 8+ chars, with 1 uppercase & 1 number", {status: 400})
        }

        await connectToDb();
        
        const userExists = await User.findOne({email})
        const newUsername = username.replace(" ", "").toLowerCase();
        
        if (userExists){
            return new Response("This email is already registered!", {status: 409})
        }

        const user = await User.create({
            email, 
            username: newUsername, 
            password,
            cardIndex: 0, 
            currentStats: {
                food: 50,
                drink: 50,
                mental: 50,
                health: 50,
            },
            daysSurvived: 0,
        });

        return new Response("User registered successfully!", {status: 201});
    } catch (error) {
        return new Response("An error occurred: " + error.message, {status: 500});
    }
}