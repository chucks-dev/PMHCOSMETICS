import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const dbConnection = await connectToDatabase();

        if (!dbConnection.success) {
            // Fallback for demo/no-db environments
            console.log("⚠️ [Newsletter] DB connection failed, simulating success for:", email);
            return NextResponse.json({
                message: "Thank you for subscribing! (Demo Mode)",
                email
            }, { status: 200 });
        }

        // Check if already exists
        const existing = await Newsletter.findOne({ email });
        if (existing) {
            return NextResponse.json({ message: "You are already subscribed!" }, { status: 400 });
        }

        await Newsletter.create({ email });

        return NextResponse.json({
            message: "Successfully subscribed to our newsletter!"
        }, { status: 201 });

    } catch (error: any) {
        console.error("🔥 Newsletter Error:", error);
        return NextResponse.json({
            message: "Something went wrong. Please try again later."
        }, { status: 500 });
    }
}
