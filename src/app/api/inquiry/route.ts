import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const dbConnection = await connectToDatabase();

        if (!dbConnection.success) {
            console.log("⚠️ [Inquiry] DB connection failed, simulating success for:", email);
            return NextResponse.json({
                message: "Thank you for your inquiry! We will get back to you soon. (Demo Mode)",
            }, { status: 200 });
        }

        await Inquiry.create({ name, email, message });

        return NextResponse.json({
            message: "Your message has been sent successfully! Our team will contact you shortly."
        }, { status: 201 });

    } catch (error: any) {
        console.error("🔥 Inquiry Error:", error);
        return NextResponse.json({
            message: "Something went wrong. Please try again later."
        }, { status: 500 });
    }
}
