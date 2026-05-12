"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import SafeImage from "@/components/ui/SafeImage";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    rating?: number;
    isNewArrival?: boolean;
    isSale?: boolean;
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);
    const [added, setAdded] = useState(false);

    // Function to render star rating
    const renderStars = (rating: number) => {
        const filledStars = Math.floor(rating);
        const emptyStars = 5 - filledStars;
        return (
            <>
                {Array(filledStars).fill(0).map((_, i) => (
                    <span key={`filled-${i}`} className="text-yellow-400">★</span>
                ))}
                {Array(emptyStars).fill(0).map((_, i) => (
                    <span key={`empty-${i}`} className="text-yellow-100">★</span>
                ))}
            </>
        );
    };

    const handleAddToCart = async () => {
        setIsAdding(true);
        try {
            addToCart(product);
            setAdded(true);
            setTimeout(() => setAdded(false), 2000); // Reset after 2 seconds
        } catch (error) {
            console.error("Failed to add to cart:", error);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="group"
        >
            <div className="bg-white rounded-lg p-6 shadow-md transition-shadow duration-300 group-hover:shadow-lg max-w-sm">
                {/* Product Image */}
                <div className="relative w-full h-64 bg-gradient-to-br from-rose-100 to-amber-100 rounded-lg mb-5 overflow-hidden flex items-center justify-center text-gray-500 text-sm transition-transform duration-300 group-hover:scale-102">
                    <SafeImage
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        fallbackType="product"
                    />
                </div>

                {/* Product Category */}
                <span className="text-[11px] font-medium tracking-[1.2px] uppercase text-[#8A8A8A] block mb-2">
                    {product.category}
                </span>

                {/* Product Title */}
                <Link href={`/products/${product.id}`} className="group/link">
                    <h2 className="text-lg font-semibold leading-snug text-[#2F2F2F] mb-3 transition-colors duration-300 group-hover/link:text-[#C47A4C]">
                        {product.name}
                    </h2>
                </Link>

                {/* Product Rating */}
                {product.rating !== undefined && product.rating > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex gap-0.5">
                            {renderStars(product.rating)}
                        </div>
                        <span className="text-xs text-[#8A8A8A] font-medium">({product.rating.toFixed(1)})</span>
                    </div>
                )}

                {/* Product Price */}
                <p className="text-xl font-bold text-[#B8860B] tracking-wide mb-4">
                    {formatPrice(product.price)}
                </p>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="w-full bg-[#3C3C3C] text-white py-3 rounded-md font-semibold text-xs uppercase tracking-wider transition-colors duration-300 hover:bg-[#2A2A2A] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isAdding ? "Adding..." : added ? "Added!" : "Add to Cart"}
                </button>
            </div>
        </motion.div>
    );
}
