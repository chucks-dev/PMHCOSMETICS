import { Schema, model, models } from "mongoose";

const OrderItemSchema = new Schema({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String },
});

const OrderSchema = new Schema({
    orderNumber: { type: String, required: true, unique: true },
    customerEmail: { type: String, required: true },
    customerName: { type: String, required: true },
    shippingAddress: {
        address: String,
        city: String,
        zipCode: String,
        country: String,
    },
    items: [OrderItemSchema],
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered"],
        default: "pending"
    },
    paymentStatus: {
        type: String,
        enum: ["unpaid", "paid", "refunded", "pending_confirmation"],
        default: "unpaid"
    },
    paymentMethod: {
        type: String,
        enum: ["paystack", "bank_transfer", "card"],
        required: true
    },
    transactionRef: String,
    confirmationStatus: {
        type: String,
        enum: ["none", "confirmed", "rejected"],
        default: "none"
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    isGuest: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const Order = models.Order || model("Order", OrderSchema);

export default Order;
