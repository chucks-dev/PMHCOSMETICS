"use client";

import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import ProductCard from "./ProductCard";
import { useState, useEffect } from "react";

export default function FeaturedProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
                if (data.success) {
                    setProducts(data.products.slice(0, 4));
                }
            } catch (error) {
                console.error("Failed to fetch featured products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <section className="py-24 px-6 md:px-12" style={{ backgroundColor: '#EDB2B1' }}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-xl">
                        <h2 className="text-3xl md:text-5xl font-serif text-secondary mb-4">Our Best Sellers</h2>
                        <p className="text-muted uppercase tracking-widest text-xs">
                            Explore our customers' favorite picks for the ultimate beauty routine
                        </p>
                    </div>
                    <Link
                        href="/products"
                        className="group flex items-center text-secondary font-medium hover:text-accent transition-colors duration-300"
                    >
                        <span className="border-b border-secondary group-hover:border-accent pb-1">Shop All Products</span>
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <Loader2 className="animate-spin text-accent" size={32} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
