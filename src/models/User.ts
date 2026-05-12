import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: "" },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    createdAt: { type: Date, default: Date.now },
});

const User = models.User || model("User", UserSchema);

export default User;
