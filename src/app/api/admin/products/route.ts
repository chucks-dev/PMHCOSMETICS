import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import { saveImage } from "@/lib/upload";

export async function GET() {
    try {
        const session = await auth();
        if (!session || (session.user as any)?.role !== "admin") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const products = await Product.find().sort({ createdAt: -1 });

        return NextResponse.json({ success: true, products });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || (session.user as any)?.role !== "admin") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const data = await req.json();

        // Process images
        const savedImages: string[] = [];
        const imagesToProcess = data.images && data.images.length > 0 ? data.images : (data.image ? [data.image] : []);

        for (const img of imagesToProcess) {
            const savedPath = await saveImage(img, "products", "prod");
            if (savedPath) {
                savedImages.push(savedPath);
            }
        }

        const newProduct = await Product.create({
            ...data,
            images: savedImages,
            image: savedImages[0] || "", // For backward compatibility
            rating: data.rating || 0,
            inventory: data.inventory || 0,
        });

        return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
    } catch (error: any) {
        console.error("Product creation API error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
