"use client";

import ProductCard from "@/components/product/ProductCard";
import { useState, useMemo, useEffect } from "react";
import { ArrowUpDown, Loader2, PackageSearch } from "lucide-react";

export default function AllProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("featured");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
                if (data.success) {
                    setProducts(data.products);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const sortedProducts = useMemo(() => {
        return [...products].sort((a, b) => {
            if (sortBy === "price-low") return a.price - b.price;
            if (sortBy === "price-high") return b.price - a.price;
            if (sortBy === "rating") return b.rating - a.rating;
            return 0; // Default featured
        });
    }, [products, sortBy]);

    return (
        <div className="pt-40 pb-24 min-h-screen" style={{ backgroundColor: '#EDB2B1' }}>
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-serif text-secondary mb-4">All Collections</h1>
                        <p className="text-muted max-w-xl">
                            Explore our complete range of premium cosmetics, skincare, and fragrances.
                            Designed for those who appreciate the finer details of beauty.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-secondary font-medium">
                            <ArrowUpDown size={16} />
                            <span>Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent border-b border-secondary/20 py-1 outline-none cursor-pointer focus:border-accent transition-colors"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Top Rated</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <Loader2 className="animate-spin text-accent" size={40} />
                    </div>
                ) : sortedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-16">
                        {sortedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <PackageSearch className="mx-auto text-muted/20 mb-4" size={48} />
                        <p className="text-secondary font-serif text-xl">No products found.</p>
                        <p className="text-muted text-sm mt-1">Please check back later as we update our catalogue.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
