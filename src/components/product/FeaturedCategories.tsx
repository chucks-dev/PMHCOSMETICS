"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SafeImage from "@/components/ui/SafeImage";

const categories = [
    {
        name: "Skincare",
        image: "/IMG-20260212-WA0070.jpg",
        href: "/category/skincare",
        description: "Nourish your skin with our serum and moisturizers.",
    },

    {
        name: "Fragrance",
        image: "/IMG-20260212-WA0071.jpg",
        href: "/category/fragrance",
        description: "Captivating scents that leave a lasting impression.",
    },
    {
        name: "Toothpaste",
        image: "/IMG-20260207-WA0025.jpg",
        href: "/category/toothpaste",
        description: "Premium oral care for a brighter, healthier smile.",
    },
];

export default function FeaturedCategories() {
    return (
        <section className="py-24 px-6 md:px-12" style={{ backgroundColor: '#EDB2B1' }}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-serif text-secondary mb-4">Shop by Category</h2>
                    <p className="text-muted max-w-lg mx-auto uppercase tracking-widest text-xs">
                        Discover our curated collections for your beauty needs
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative overflow-hidden aspect-[4/5] bg-primary/10 rounded-2xl"
                        >
                            <SafeImage
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                fallbackType="category"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
                            <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-2xl font-serif text-white mb-2">{category.name}</h3>
                                <p className="text-white/70 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {category.description}
                                </p>
                                <Link
                                    href={category.href}
                                    className="inline-block text-white text-xs uppercase tracking-widest border-b border-white pb-1"
                                >
                                    Explore Collection
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
