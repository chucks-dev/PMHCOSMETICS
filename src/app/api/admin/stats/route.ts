import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

export async function GET() {
    try {

        await connectToDatabase();

        // Get total revenue from confirmed/paid orders
        const orders = await Order.find({ paymentStatus: "paid" });
        const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);

        // Get total counts
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const activeCustomers = await User.countDocuments({ role: "customer" });

        // Get recent orders (last 5)
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("orderNumber customerName paymentStatus paymentMethod total createdAt");

        // Get inventory alerts (stock < 10)
        const lowStockProducts = await Product.find({ inventory: { $lt: 10 } })
            .select("name inventory")
            .limit(5);

        return NextResponse.json({
            success: true,
            stats: {
                totalRevenue,
                totalOrders,
                totalProducts,
                activeCustomers,
            },
            recentOrders,
            inventoryAlerts: lowStockProducts
        });
    } catch (error: any) {
        console.error("Stats API error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
