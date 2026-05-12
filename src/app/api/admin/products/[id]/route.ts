import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import { saveImage } from "@/lib/upload";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const data = await req.json();

        await connectToDatabase();

        // Process images if provided
        if (data.images || data.image) {
            const savedImages: string[] = [];
            const imagesToProcess = data.images && data.images.length > 0 ? data.images : (data.image ? [data.image] : []);

            for (const img of imagesToProcess) {
                // saveImage handles both base64 and existing URLs
                const savedPath = await saveImage(img, "products", "prod");
                if (savedPath) {
                    savedImages.push(savedPath);
                }
            }
            data.images = savedImages;
            data.image = savedImages[0] || "";
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { ...data },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, product: updatedProduct });
    } catch (error: any) {
        console.error("Product update API error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        

        const { id } = await params;

        await connectToDatabase();
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Product deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
