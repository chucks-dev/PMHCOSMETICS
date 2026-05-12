import fs from "fs";
import path from "path";

/**
 * Saves a base64 image to the filesystem and returns the relative URL.
 * @param base64Image The base64 string including the data:image prefix.
 * @param subDir The subdirectory within public/uploads/
 * @param prefix The prefix for the filename
 * @returns The relative URL of the saved image or null if failed.
 */
export async function saveImage(base64Image: string, subDir: string, prefix: string): Promise<string | null> {
    if (!base64Image || !base64Image.startsWith("data:image")) {
        // If it's already a URL (e.g. starting with /uploads), return it as is
        if (base64Image.startsWith("/")) return base64Image;
        return null;
    }

    try {
        const uploadDir = path.join(process.cwd(), "public", "uploads", subDir);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
        const extension = base64Image.substring("data:image/".length, base64Image.indexOf(";base64")).replace("jpeg", "jpg");
        const fileName = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}.${extension}`;
        const filePath = path.join(uploadDir, fileName);

        fs.writeFileSync(filePath, base64Data, "base64");
        return `/uploads/${subDir}/${fileName}`;
    } catch (err) {
        console.error("❌ Upload error:", err);
        return null;
    }
}
