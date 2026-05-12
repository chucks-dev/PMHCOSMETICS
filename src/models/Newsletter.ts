import mongoose from "mongoose";

const NewsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
    },
    subscribedAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["active", "unsubscribed"],
        default: "active",
    }
});

// Avoid model recompilation error
export default mongoose.models.Newsletter || mongoose.model("Newsletter", NewsletterSchema);
