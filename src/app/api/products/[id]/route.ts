import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;

        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
        }

        const mappedProduct = {
            ...product.toObject(),
            id: product._id.toString(),
            image: product.images?.[0] || product.image || "/placeholder.png"
        };

        return NextResponse.json({ success: true, product: mappedProduct });
    } catch (error: any) {
        console.error("Single product API error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 });
    }
}
