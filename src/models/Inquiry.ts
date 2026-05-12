import mongoose from "mongoose";

const InquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
    },
    message: {
        type: String,
        required: [true, "Message is required"],
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["new", "read", "replied"],
        default: "new",
    }
});

export default mongoose.models.Inquiry || mongoose.model("Inquiry", InquirySchema);
