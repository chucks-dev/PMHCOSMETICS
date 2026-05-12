import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    category: { type: String, required: true },
    image: { type: String }, // Keep for backward compatibility if needed, but primary will be images
    images: { type: [String], default: [] },
    rating: { type: Number, default: 0 },
    description: { type: String },
    ingredients: { type: String },
    usageInstructions: { type: String },
    isNewArrival: { type: Boolean, default: false },
    isSale: { type: Boolean, default: false },
    inventory: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

const Product = models.Product || model("Product", ProductSchema);

export default Product;
