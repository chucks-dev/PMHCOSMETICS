"use client";

import { use, useState, useMemo, useEffect } from "react";
import ProductCard from "@/components/product/ProductCard";
import { Filter, ChevronDown, SlidersHorizontal, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = use(params);
    const [sortBy, setSortBy] = useState("featured");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`/api/products?category=${slug}`);
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
    }, [slug]);

    const filteredProducts = useMemo(() => {
        return products
            .sort((a, b) => {
                if (sortBy === "price-low") return a.price - b.price;
                if (sortBy === "price-high") return b.price - a.price;
                if (sortBy === "rating") return b.rating - a.rating;
                return 0; // featured
            });
    }, [products, sortBy]);

    return (
        <div className="pt-32 pb-24 px-6 md:px-12" style={{ backgroundColor: '#EDB2B1' }}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-xs uppercase tracking-[0.3em] text-accent mb-4 block font-bold">Collection</span>
                    <h1 className="text-4xl md:text-6xl font-serif text-secondary mb-6">{categoryName}</h1>
                    <p className="text-muted max-w-2xl mx-auto leading-relaxed">
                        Elevate your daily ritual with our curated selection of premium {slug} products.
                        Crafted with the finest ingredients for exceptional results.
                    </p>
                </div>

                {/* Filters & Sort Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between border-y border-zinc-100 py-6 mb-12 gap-6">
                    <div className="flex items-center gap-8">
                        <button className="flex items-center gap-2 text-sm uppercase tracking-widest text-secondary hover:text-accent transition-colors">
                            <SlidersHorizontal size={16} />
                            Filter
                        </button>
                        <div className="hidden md:flex items-center gap-4">
                            <span className="text-xs uppercase tracking-widest text-muted">Showing {filteredProducts.length} items</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-xs uppercase tracking-widest text-muted hidden md:block">Sort By:</span>
                        <div className="relative group">
                            <button className="flex items-center gap-2 text-sm uppercase tracking-widest text-secondary font-medium outline-none">
                                {sortBy === "featured" ? "Featured" :
                                    sortBy === "price-low" ? "Price: Low to High" :
                                        sortBy === "price-high" ? "Price: High to Low" : "Top Rated"}
                                <ChevronDown size={14} />
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-48 border border-zinc-100 shadow-premium rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-20" style={{ backgroundColor: '#EDB2B1' }}>
                                <div className="p-2 flex flex-col">
                                    {["featured", "price-low", "price-high", "rating"].map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => setSortBy(option)}
                                            className={cn(
                                                "text-left px-4 py-2 text-xs uppercase tracking-widest hover:bg-primary/20 rounded-lg transition-colors",
                                                sortBy === option ? "text-accent font-bold" : "text-secondary"
                                            )}
                                        >
                                            {option.replace("-", " ")}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <Loader2 className="animate-spin text-accent" size={32} />
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-muted text-lg">No products found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
