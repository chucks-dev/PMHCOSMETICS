"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section
            className="h-screen w-full bg-cover bg-center flex items-center relative"
            style={{
                backgroundImage: "url('/IMG-20260213-WA0004.jpg')",
            }}
        >
            <div className="absolute inset-0 bg-black/20" />

            <div className="relative z-10 w-full h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 h-full items-center px-6 md:px-20 max-w-7xl mx-auto">
                    {/* LEFT SIDE EMPTY (Keeps Space for Model on Left) */}
                    <div className="hidden md:block"></div>

                    {/* RIGHT CONTENT */}
                    <div className="text-right text-white max-w-xl md:ml-auto">
                        <motion.h1
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight"
                        >
                            Beauty that <br /> feels natural
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="mt-6 text-lg md:text-xl text-gray-200 font-medium max-w-lg"
                        >
                            Discover original skincare products <br />
                            that bring out your glow with pure, premium ingredients.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="mt-8"
                        >
                            <Link
                                href="/products"
                                className="px-10 py-4 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 text-sm uppercase tracking-widest inline-block"
                            >
                                Shop Now
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
