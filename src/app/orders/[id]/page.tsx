"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { ListOrdered, Package, Truck, CreditCard, ChevronLeft, MapPin, Calendar, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn, formatPrice } from "@/lib/utils";

interface OrderTrackingPageProps {
    params: Promise<{ id: string }>;
}

export default function OrderTrackingPage({ params }: OrderTrackingPageProps) {
    const { id } = use(params);
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // In a real app we'd fetch by orderNumber or ID from DB
                // Since this is guest tracking, we search by orderNumber
                const res = await fetch(`/api/orders`);
                const data = await res.json();
                if (data.success) {
                    const foundOrder = data.orders.find((o: any) => o.orderNumber === id || o.transactionRef === id || o._id === id);
                    setOrder(foundOrder);
                }
            } catch (error) {
                console.error("Tracking error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen pt-40 px-6 text-center">
                <div className="max-w-md mx-auto">
                    <Package size={48} className="text-muted/20 mx-auto mb-6" />
                    <h1 className="text-3xl font-serif text-secondary mb-4">Order Not Found</h1>
                    <p className="text-muted mb-8">We couldn't find an order with the reference <span className="text-secondary font-bold">#{id}</span>. Please double check your order ID.</p>
                    <Link href="/" className="bg-secondary text-white px-8 py-4 rounded-full text-sm uppercase tracking-widest hover:bg-secondary/90 transition-all font-medium">Return Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-24" style={{ backgroundColor: '#EDB2B1' }}>
            <div className="max-w-4xl mx-auto px-6 md:px-12">
                <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-muted hover:text-secondary transition-colors mb-8">
                    <ChevronLeft size={16} /> Home
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Tracking Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="p-8 md:p-12 rounded-[40px] shadow-sm border border-zinc-100" style={{ backgroundColor: '#EDB2B1' }}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                                <div>
                                    <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold mb-2 block">Tracking Dashboard</span>
                                    <h1 className="text-3xl font-serif text-secondary">Order #{order.orderNumber}</h1>
                                </div>
                                <div className={cn(
                                    "px-6 py-3 rounded-2xl flex items-center gap-3",
                                    order.paymentStatus === "paid" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                                )}>
                                    {order.paymentStatus === "paid" ? <CheckCircle size={20} /> : <Clock size={20} />}
                                    <div className="text-left">
                                        <p className="text-[9px] uppercase tracking-widest font-bold leading-none opacity-60">Status</p>
                                        <p className="text-sm font-bold uppercase tracking-widest">{order.paymentStatus.replace("_", " ")}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="relative space-y-12 before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-100">
                                <TimelineStep
                                    icon={Package}
                                    title="Order Placed"
                                    date={new Date(order.createdAt).toLocaleDateString()}
                                    completed
                                />
                                <TimelineStep
                                    icon={CreditCard}
                                    title="Payment Confirmed"
                                    date={order.paymentStatus === "paid" ? "Verified" : "Awaiting..."}
                                    completed={order.paymentStatus === "paid"}
                                    active={order.paymentStatus !== "paid"}
                                />
                                <TimelineStep
                                    icon={Clock}
                                    title="Processing"
                                    date="Est. 1-2 days"
                                    completed={order.status === "processing" || order.status === "shipped"}
                                />
                                <TimelineStep
                                    icon={Truck}
                                    title="Out for Delivery"
                                    date="Est. 3-5 days"
                                    completed={order.status === "shipped"}
                                />
                            </div>
                        </section>

                        <section className="p-8 md:p-12 rounded-[40px] shadow-sm border border-zinc-100" style={{ backgroundColor: '#EDB2B1' }}>
                            <h3 className="text-xl font-serif text-secondary mb-8">Shipping Information</h3>
                            <div className="flex gap-4 items-start">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-secondary flex-shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div className="text-sm text-muted leading-relaxed">
                                    <p className="font-bold text-secondary mb-1">{order.customerName}</p>
                                    <p>{order.shippingAddress.address}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
                                    <p>{order.shippingAddress.country}</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Order Summary */}
                    <div className="space-y-8">
                        <section className="bg-secondary text-white p-8 rounded-[40px] shadow-xl">
                            <h3 className="text-xl font-serif mb-8 border-b border-white/10 pb-4">Order Summary</h3>
                            <div className="space-y-4 mb-8">
                                {order.items.map((item: any) => (
                                    <div key={item.productId} className="flex justify-between text-sm">
                                        <span className="opacity-60">{item.name} x{item.quantity}</span>
                                        <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-white/10 pt-6 space-y-4">
                                <div className="flex justify-between text-sm opacity-60">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(order.total)}</span>
                                </div>
                                <div className="flex justify-between items-end pt-2">
                                    <span className="font-serif text-lg">Total</span>
                                    <span className="text-2xl font-bold">{formatPrice(order.total)}</span>
                                </div>
                            </div>
                        </section>

                        <div className="p-6 rounded-3xl border border-zinc-100 text-center" style={{ backgroundColor: '#EDB2B1' }}>
                            <p className="text-xs text-muted mb-4 uppercase tracking-widest font-bold">Payment Method</p>
                            <div className="flex items-center justify-center gap-2 text-secondary font-bold text-sm">
                                {order.paymentMethod === "paystack" ? <CreditCard size={16} /> : <Truck size={16} />}
                                {order.paymentMethod.replace("_", " ").toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TimelineStep({ icon: Icon, title, date, completed, active }: any) {
    return (
        <div className="flex gap-6 relative z-10">
            <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center border-4 border-white transition-all duration-500",
                completed ? "bg-accent text-white" : active ? "bg-primary text-secondary ring-4 ring-primary/20" : "bg-zinc-100 text-muted"
            )}>
                <Icon size={20} />
            </div>
            <div className="flex flex-col justify-center">
                <p className={cn(
                    "text-sm font-bold uppercase tracking-widest mb-0.5",
                    completed || active ? "text-secondary" : "text-muted"
                )}>{title}</p>
                <p className="text-[10px] text-muted font-medium uppercase tracking-[0.2em]">{date}</p>
            </div>
        </div>
    );
}
