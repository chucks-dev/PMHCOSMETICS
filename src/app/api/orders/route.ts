import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const data = await req.json();

        const {
            customerEmail,
            customerName,
            shippingAddress,
            items,
            total,
            paymentMethod,
            transactionRef,
            userId,
            isGuest,
        } = data;

        // Generate a simple order number
        const orderNumber = "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase();

        const newOrder = await Order.create({
            orderNumber,
            customerEmail,
            customerName,
            shippingAddress,
            items,
            total,
            paymentMethod,
            transactionRef,
            userId,
            isGuest,
            paymentStatus: paymentMethod === "paystack" ? "paid" : "pending_confirmation",
            status: "pending",
            confirmationStatus: "none"
        });

        return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
    } catch (error: any) {
        console.error("Order creation error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function GET(req: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const method = searchParams.get("method");
        const status = searchParams.get("status");

        let query: any = {};
        if (method) query.paymentMethod = method;
        if (status) query.paymentStatus = status;

        const email = searchParams.get("email");
        const userId = searchParams.get("userId");
        if (email) query.customerEmail = email;
        if (userId) query.userId = userId;

        const orders = await Order.find(query).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, orders });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const { orderId, action, status } = body;

        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
        }

        if (action === "confirm") {
            order.paymentStatus = "paid";
            order.confirmationStatus = "confirmed";
        } else if (action === "reject") {
            order.confirmationStatus = "rejected";
        } else if (action === "update_status" && status) {
            order.status = status;
        }

        await order.save();
        return NextResponse.json({ success: true, order });
    } catch (error: any) {
        console.error("Order update error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
