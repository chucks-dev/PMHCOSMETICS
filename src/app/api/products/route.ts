import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req: Request) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");

        const query: any = { isAvailable: true };
        if (category && category !== "all") {
            // Case-insensitive regex for category to match "Skincare" and "skincare"
            query.category = { $regex: new RegExp(`^${category}$`, "i") };
        }

        const products = await Product.find(query).sort({ createdAt: -1 });

        // Map _id to id and ensure image represents the first in images if available
        const mappedProducts = products.map((p: any) => ({
            ...p.toObject(),
            id: p._id.toString(),
            image: p.images?.[0] || p.image || "/placeholder.png"
        }));

        return NextResponse.json({ success: true, products: mappedProducts });
    } catch (error: any) {
        console.error("Public products API error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
    }
}
