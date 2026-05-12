"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Package, Truck, ArrowRight, ShoppingBag, CreditCard, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

interface OrderConfirmationPageProps {
    params: Promise<{ id: string }>;
}

export default function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
    const { id } = use(params);
    const searchParams = useSearchParams();
    const method = searchParams.get("method");
    const status = searchParams.get("status");

    return (
        <div className="min-h-screen flex items-center justify-center pt-24 pb-24" style={{ backgroundColor: '#EDB2B1' }}>
            <div className="max-w-2xl px-6 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="mb-10 inline-block bg-primary/20 p-6 rounded-full"
                >
                    <CheckCircle2 size={64} className="text-secondary" strokeWidth={1} />
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <span className="text-xs uppercase tracking-[0.4em] text-accent mb-4 block font-bold">Thank you for your order</span>
                    <h1 className="text-4xl md:text-6xl font-serif text-secondary mb-6">Confirmed.</h1>

                    <div className="bg-zinc-50 border border-zinc-100 p-6 rounded-3xl mb-10 text-left">
                        <p className="text-sm text-muted mb-4 leading-relaxed">
                            Your order <span className="text-secondary font-bold">#{id}</span> has been received and is being prepared with care.
                        </p>

                        {method === "bank_transfer" ? (
                            <div className="flex items-start gap-3 bg-yellow-50 p-4 rounded-2xl border border-yellow-100">
                                <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                                <div className="text-xs text-yellow-800 leading-relaxed">
                                    <strong>Awaiting Payment Confirmation:</strong> Since you chose Bank Transfer, our team will verify your payment via WhatsApp. This usually takes 5-15 minutes.
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start gap-3 bg-green-50 p-4 rounded-2xl border border-green-100">
                                <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                                <div className="text-xs text-green-800 leading-relaxed">
                                    <strong>Payment Successful:</strong> Your Paystack payment was confirmed instantly. We've started processing your delivery.
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="p-8 rounded-3xl border border-zinc-100 text-left flex items-start gap-4 shadow-sm" style={{ backgroundColor: '#EDB2B1' }}>
                            <Package size={24} className="text-accent flex-shrink-0" />
                            <div>
                                <h4 className="text-sm font-bold text-secondary uppercase tracking-widest mb-1">Status</h4>
                                <p className="text-sm text-muted">{method === "bank_transfer" ? "Awaiting verification" : "Fulfillment in progress"}</p>
                            </div>
                        </div>
                        <div className="p-8 rounded-3xl border border-zinc-100 text-left flex items-start gap-4 shadow-sm" style={{ backgroundColor: '#EDB2B1' }}>
                            <Truck size={24} className="text-accent flex-shrink-0" />
                            <div>
                                <h4 className="text-sm font-bold text-secondary uppercase tracking-widest mb-1">Delivery</h4>
                                <p className="text-sm text-muted">Expected by Feb {new Date().getDate() + 4} - {new Date().getDate() + 7}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/products"
                            className="bg-secondary text-white px-10 py-5 rounded-full text-sm uppercase tracking-widest hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 group"
                        >
                            <ShoppingBag size={18} />
                            Continue Shopping
                        </Link>
                        <Link
                            href={`/orders/${id}`}
                            className="px-10 py-5 rounded-full text-sm uppercase tracking-widest border border-zinc-200 hover:bg-zinc-50 transition-all flex items-center justify-center gap-2"
                        >
                            Order Tracking
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
