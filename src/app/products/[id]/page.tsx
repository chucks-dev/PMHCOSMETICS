"use client";

import { use, useState, useEffect } from "react";
import SafeImage from "@/components/ui/SafeImage";
import { useCart } from "@/context/CartContext";
import { Star, Minus, Plus, ShoppingBag, Heart, Share2, ShieldCheck, Truck, RefreshCw, Loader2 } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import FeaturedProducts from "@/components/product/FeaturedProducts";

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
    const { id } = use(params);
    const { addToCart } = useCart();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                const data = await res.json();
                if (data.success) {
                    setProduct(data.product);
                }
            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="pt-40 pb-24 flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-accent" size={40} />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pt-40 pb-24 text-center min-h-screen">
                <h1 className="text-4xl font-serif text-secondary mb-4 font-bold">Product Not Found</h1>
                <p className="text-muted">The product you are looking for doesn't exist or has been removed.</p>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const productImages = product.images?.length > 0 ? product.images : [product.image];

    return (
        <div style={{ backgroundColor: '#EDB2B1' }}>
            <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Image Gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <div className="relative aspect-square overflow-hidden bg-primary/10 rounded-2xl border border-zinc-100 shadow-sm">
                            <SafeImage
                                src={productImages[activeImage]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        {productImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {productImages.map((img: string, i: number) => (
                                    <div
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={cn(
                                            "aspect-square bg-primary/10 rounded-xl overflow-hidden cursor-pointer transition-all relative border",
                                            activeImage === i ? "ring-2 ring-accent border-transparent" : "hover:border-accent/40 border-zinc-100"
                                        )}
                                    >
                                        <SafeImage
                                            src={img}
                                            alt={`${product.name} view ${i + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col"
                    >
                        <div className="mb-8">
                            <span className="text-xs uppercase tracking-[0.3em] text-accent mb-4 block font-bold">
                                {product.category}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-serif text-secondary mb-4 leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center text-accent">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"}
                                        />
                                    ))}
                                    <span className="text-xs ml-2 font-bold text-secondary">{product.rating || 0}</span>
                                </div>
                                <span className="text-zinc-300">|</span>
                                <span className="text-xs text-muted uppercase tracking-widest">{product.inventory || 0} In Stock</span>
                            </div>
                            <p className="text-3xl font-medium text-secondary">
                                {formatPrice(product.price)}
                            </p>
                        </div>

                        <p className="text-muted leading-relaxed mb-10 max-w-md">
                            {product.description || "No description available for this product."}
                        </p>

                        <div className="space-y-6 mb-10">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center border border-zinc-200 rounded-full px-4 py-2 bg-zinc-50/50">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-1 hover:text-accent transition-colors"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-12 text-center font-medium">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="p-1 hover:text-accent transition-colors"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    className={cn(
                                        "flex-grow bg-secondary text-white py-4 rounded-full text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 font-bold shadow-lg",
                                        added ? "bg-green-600 scale-[0.98]" : "hover:bg-secondary/90 hover:shadow-accent/20"
                                    )}
                                >
                                    <ShoppingBag size={18} />
                                    {added ? "Added to Cart" : "Add to Cart"}
                                </button>
                                <button className="p-4 border border-zinc-200 rounded-full hover:bg-zinc-50 transition-colors shadow-sm">
                                    <Heart size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Features trust */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-zinc-100">
                            <div className="flex flex-col items-center text-center gap-2">
                                <Truck size={20} className="text-accent" strokeWidth={1.5} />
                                <span className="text-[10px] uppercase tracking-widest font-bold">Free Shipping</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2">
                                <ShieldCheck size={20} className="text-accent" strokeWidth={1.5} />
                                <span className="text-[10px] uppercase tracking-widest font-bold">Secure Checkout</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2">
                                <RefreshCw size={20} className="text-accent" strokeWidth={1.5} />
                                <span className="text-[10px] uppercase tracking-widest font-bold">30-Day Returns</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Featured Products as "You May Also Like" */}
            <div className="border-t border-zinc-50">
                <FeaturedProducts />
            </div>
        </div>
    );
}
