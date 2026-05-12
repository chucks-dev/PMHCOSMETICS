"use client";

import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, X, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

    if (cartCount === 0) {
        return (
            <div className="pt-40 pb-24 px-6 text-center h-[70vh] flex flex-col items-center justify-center">
                <div className="bg-primary/10 p-8 rounded-full mb-8">
                    <ShoppingBag size={64} className="text-secondary/20" strokeWidth={2} />
                </div>
                <h1 className="text-4xl font-serif text-secondary mb-5">Your Cart is Empty</h1>
                <p className="text-muted mb-10 max-w-md mx-auto">
                    It looks like you haven't added anything to your cart yet.
                    Discover our collections and find something you'll love.
                </p>
                <Link
                    href="/products"
                    className="bg-secondary text-white px-5 py-4 rounded-full text-sm uppercase tracking-widest hover:bg-secondary/90 transition-all font-medium"
                >
                    Explore Collection
                </Link>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#EDB2B1' }}>
            <div className="pt-40 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-serif text-secondary mb-12">Your Shopping Bag</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Cart Items */}
                    <div className="lg:col-span-8">
                        <div className="space-y-8">
                            <AnimatePresence>
                                {cart.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-zinc-100 last:border-0 group"
                                    >
                                        <div className="relative w-full sm:w-32 aspect-square bg-primary/10 rounded-2xl overflow-hidden self-start">
                                            <SafeImage
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="flex-grow flex flex-col sm:flex-row justify-between gap-4">
                                            <div className="space-y-1">
                                                <span className="text-[10px] uppercase tracking-widest text-accent font-bold">
                                                    {item.category}
                                                </span>
                                                <Link href={`/products/${item.id}`} className="hover:text-accent transition-colors">
                                                    <h3 className="text-xl font-serif text-secondary">{item.name}</h3>
                                                </Link>
                                                <p className="text-sm text-secondary font-medium">
                                                    ${item.price.toFixed(2)}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-8 self-end sm:self-center">
                                                <div className="flex items-center border border-zinc-200 rounded-full px-3 py-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 hover:text-accent transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 hover:text-accent transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <p className="text-secondary font-bold w-20 text-right">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-zinc-300 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                        <div className="bg-zinc-50 rounded-3xl p-8 shadow-premium">
                            <h2 className="text-2xl font-serif text-secondary mb-8">Order Summary</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted">Subtotal ({cartCount} items)</span>
                                    <span className="text-secondary font-medium">{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted">Estimated Shipping</span>
                                    <span className="text-secondary font-medium">{cartTotal > 75000 ? "FREE" : formatPrice(2500)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted">Tax</span>
                                    <span className="text-secondary font-medium">{formatPrice(0)}</span>
                                </div>
                            </div>

                            <div className="border-t border-zinc-200 pt-6 mb-10">
                                <div className="flex justify-between items-end">
                                    <span className="text-secondary font-serif text-xl">Total</span>
                                    <span className="text-secondary text-2xl font-bold">
                                        {formatPrice(cartTotal > 75000 ? cartTotal : cartTotal + 5000)}
                                    </span>
                                </div>
                                <p className="text-[10px] text-muted uppercase tracking-widest mt-2">
                                    Prices inclusive of VAT where applicable
                                </p>
                            </div>

                            <Link
                                href="/checkout"
                                className="w-full bg-secondary text-white py-5 rounded-full text-sm uppercase tracking-[0.2em] font-bold hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 group shadow-xl"
                            >
                                Proceed to Checkout
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <div className="mt-8 space-y-4">
                                <div className="flex items-center justify-center gap-4 grayscale opacity-40">
                                    <div className="w-10 h-6 bg-zinc-200 rounded" />
                                    <div className="w-10 h-6 bg-zinc-200 rounded" />
                                    <div className="w-10 h-6 bg-zinc-200 rounded" />
                                </div>
                                <p className="text-center text-[10px] text-zinc-400 uppercase tracking-widest">
                                    Secure checkout with 256-bit SSL encryption
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
