"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

declare global {
    interface Window {
        PaystackPop: any;
    }
}
import { useCart } from "@/context/CartContext";
import { ShieldCheck, ChevronLeft, ArrowRight, Truck, CreditCard, AlertCircle, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SafeImage from "@/components/ui/SafeImage";
import { cn, formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, cartTotal, cartCount, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"paystack" | "bank_transfer">("paystack");
    const [checkoutStep, setCheckoutStep] = useState<"form">("form");

    const BANK_DETAILS = {
        bankName: "Sterling",
        accountName: "Chijioke Promise Adaeze",
        accountNumber: "0099010938",
        agentPhone: "2348122881797" // International format without +
    };

    const [formData, setFormData] = useState({
        email: "",
        phoneNumber: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        zipCode: "",
        country: "Nigeria",
    });

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://js.paystack.co/v1/inline.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const createOrder = async (transactionRef?: string) => {
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerEmail: formData.email,
                    customerName: `${formData.firstName} ${formData.lastName}`,
                    shippingAddress: {
                        address: formData.address,
                        city: formData.city,
                        zipCode: formData.zipCode,
                        country: formData.country,
                    },
                    items: cart.map(item => ({
                        productId: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image,
                    })),
                    total: total,
                    paymentMethod: paymentMethod,
                    transactionRef: transactionRef || `BT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                }),
            });

            const data = await res.json();
            if (data.success) {
                return data.order;
            }
            throw new Error(data.error || "Failed to create order");
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    };

    const handleWhatsAppRedirect = async () => {
        setIsProcessing(true);
        try {
            const order = await createOrder();
            const orderId = order.orderNumber;
            const itemsList = cart.map(item => `- ${item.name} (x${item.quantity})`).join("\n");
            const message = `Hello, I have made payment for my order.\n\n` +
                `Customer Name: ${formData.firstName} ${formData.lastName}\n` +
                `Phone Number: ${formData.phoneNumber}\n` +
                `Delivery Address: ${formData.address}, ${formData.city}\n\n` +
                `Items Ordered:\n${itemsList}\n\n` +
                `Total Amount Paid: ${formatPrice(total)}\n\n` +
                `Order ID: ${orderId}\n` +
                `Payment Method: Bank Transfer\n\n` +
                `Please confirm my payment. Thank you.`;

            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/${BANK_DETAILS.agentPhone}?text=${encodedMessage}`, "_blank");

            clearCart();
            router.push(`/order-confirmation/${orderId}?method=bank_transfer`);
        } catch (error) {
            alert("There was an error processing your order. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();

        if (paymentMethod === "bank_transfer") {
            handleWhatsAppRedirect();
            return;
        }

        if (!window.PaystackPop) {
            alert("Payment gateway is still loading. Please try again in a moment.");
            return;
        }

        const handler = window.PaystackPop.setup({
            key: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Replace with real key
            email: formData.email,
            amount: Math.round(total * 100),
            currency: 'NGN',
            ref: 'PMH-' + Math.floor((Math.random() * 1000000000) + 1),
            callback: async (response: any) => {
                setIsProcessing(true);
                try {
                    const order = await createOrder(response.reference);
                    clearCart();
                    router.push(`/order-confirmation/${order.orderNumber}?method=paystack&status=paid`);
                } catch (error) {
                    console.error("Failed to link order:", error);
                    // Still push to confirmation as payment was successful
                    router.push(`/order-confirmation/${response.reference}?method=paystack&status=paid&error=sync`);
                } finally {
                    setIsProcessing(false);
                }
            },
            onClose: () => {
                setIsProcessing(false);
            }
        });

        handler.openIframe();
    };

    if (cartCount === 0) {
        return (
            <div className="pt-40 pb-24 text-center">
                <h1 className="text-3xl font-serif mb-6">Your cart is empty</h1>
                <Link href="/products" className="text-accent underline">Return to shop</Link>
            </div>
        );
    }

    const shipping = cartTotal > 75000 ? 0 : 5000;
    const total = cartTotal + shipping;

    return (
        <div className="pt-32 pb-24" style={{ backgroundColor: '#EDB2B1' }}>
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex items-center gap-2 mb-12">
                    <Link href="/cart" className="text-muted hover:text-secondary transition-colors flex items-center gap-1 text-sm uppercase tracking-widest font-bold">
                        <ChevronLeft size={16} />
                        Back to Cart
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Checkout Form */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handlePlaceOrder} className="space-y-10">
                            {/* Contact Info */}
                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-serif text-secondary">Contact Information</h2>
                                    <p className="text-xs text-muted">Need to save your details? <button type="button" onClick={() => setCheckoutStep("auth_prompt")} className="text-accent hover:underline font-bold">Sign In</button></p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-50 border border-zinc-200 px-6 py-4 rounded-xl outline-none focus:border-accent transition-colors"
                                    />
                                    <input
                                        required
                                        type="tel"
                                        name="phoneNumber"
                                        placeholder="Phone Number"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-50 border border-zinc-200 px-6 py-4 rounded-xl outline-none focus:border-accent transition-colors"
                                    />
                                </div>
                            </section>

                            {/* Shipping Info */}
                            <section>
                                <h2 className="text-2xl font-serif text-secondary mb-6">Shipping Address</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <input
                                        required
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-50 border border-zinc-200 px-6 py-4 rounded-xl outline-none focus:border-accent transition-colors"
                                    />
                                    <input
                                        required
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-50 border border-zinc-200 px-6 py-4 rounded-xl outline-none focus:border-accent transition-colors"
                                    />
                                </div>
                                <input
                                    required
                                    type="text"
                                    name="address"
                                    placeholder="Address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-50 border border-zinc-200 px-6 py-4 rounded-xl outline-none focus:border-accent transition-colors mb-4"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input
                                        required
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-50 border border-zinc-200 px-6 py-4 rounded-xl outline-none focus:border-accent transition-colors md:col-span-2"
                                    />
                                    <input
                                        required
                                        type="text"
                                        name="zipCode"
                                        placeholder="ZIP Code"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-50 border border-zinc-200 px-6 py-4 rounded-xl outline-none focus:border-accent transition-colors"
                                    />
                                </div>
                            </section>

                            {/* Payment Info */}
                            <section className="space-y-6">
                                <h2 className="text-2xl font-serif text-secondary mb-6">Payment Method</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div
                                        onClick={() => setPaymentMethod("paystack")}
                                        className={cn(
                                            "p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-3",
                                            paymentMethod === "paystack" ? "border-accent bg-accent/5 shadow-md" : "border-zinc-100 bg-zinc-50 hover:bg-zinc-100"
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className={cn(
                                                "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                paymentMethod === "paystack" ? "border-accent" : "border-zinc-300"
                                            )}>
                                                {paymentMethod === "paystack" && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
                                            </div>
                                            <CreditCard size={20} className={paymentMethod === "paystack" ? "text-accent" : "text-muted"} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-secondary">Pay with Paystack</p>
                                            <p className="text-[10px] text-muted uppercase tracking-widest mt-1">Instant Confirmation</p>
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => setPaymentMethod("bank_transfer")}
                                        className={cn(
                                            "p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-3",
                                            paymentMethod === "bank_transfer" ? "border-accent bg-accent/5 shadow-md" : "border-zinc-100 bg-zinc-50 hover:bg-zinc-100"
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className={cn(
                                                "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                paymentMethod === "bank_transfer" ? "border-accent" : "border-zinc-300"
                                            )}>
                                                {paymentMethod === "bank_transfer" && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
                                            </div>
                                            <Truck size={20} className={paymentMethod === "bank_transfer" ? "text-accent" : "text-muted"} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-secondary">Bank Transfer</p>
                                            <p className="text-[10px] text-muted uppercase tracking-widest mt-1">Manual Verification</p>
                                        </div>
                                    </div>
                                </div>

                                {paymentMethod === "bank_transfer" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-accent/5 p-8 rounded-3xl border border-accent/20 space-y-4"
                                    >
                                        <h3 className="font-serif text-lg text-secondary">Manual Bank Transfer</h3>
                                        <p className="text-sm text-secondary/70 leading-relaxed">
                                            Please transfer the total amount to the account below, then click the confirmation button to verify via WhatsApp.
                                        </p>
                                        <div className="p-6 rounded-2xl border border-accent/10 space-y-3" style={{ backgroundColor: '#f5c9c8' }}>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted">Bank Name</span>
                                                <span className="text-secondary font-bold">{BANK_DETAILS.bankName}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted">Account Name</span>
                                                <span className="text-secondary font-bold">{BANK_DETAILS.accountName}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted">Account Number</span>
                                                <span className="text-secondary font-bold tracking-widest">{BANK_DETAILS.accountNumber}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                            <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                                            <p className="text-[11px] text-yellow-800 leading-normal">
                                                <strong>Note:</strong> Bank transfer payments may take some minutes to confirm. Please include your order ID in the transfer narration if possible.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </section>

                            {paymentMethod === "paystack" ? (
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className={cn(
                                        "w-full bg-secondary text-white py-6 rounded-full text-sm uppercase tracking-[0.3em] font-bold transition-all flex items-center justify-center gap-3 shadow-2xl overflow-hidden relative",
                                        isProcessing ? "opacity-90" : "hover:bg-secondary/90"
                                    )}
                                >
                                    {isProcessing ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                                        />
                                    ) : (
                                        <>
                                            Pay with Paystack
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleWhatsAppRedirect}
                                    className="w-full bg-accent text-white py-6 rounded-full text-sm uppercase tracking-[0.3em] font-bold transition-all flex items-center justify-center gap-3 shadow-2xl hover:bg-accent/90"
                                >
                                    I Have Made Payment
                                    <ArrowRight size={18} />
                                </button>
                            )}
                        </form>
                    </div>

                    {/* Sidebar Area: Mini Cart Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-zinc-50 rounded-3xl p-8 sticky top-32 border border-zinc-100">
                            <h2 className="text-xl font-serif text-secondary mb-8 border-b border-zinc-200 pb-4">In Your Bag</h2>
                            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative w-16 h-16 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-zinc-100">
                                            <SafeImage src={item.image} alt={item.name} fill className="object-cover" />
                                            <span className="absolute -top-1 -right-1 bg-secondary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-grow flex flex-col justify-center">
                                            <h4 className="text-sm font-serif text-secondary leading-tight">{item.name}</h4>
                                            <p className="text-[10px] text-muted uppercase tracking-widest">{item.category}</p>
                                        </div>
                                        <span className="text-sm font-medium text-secondary self-center">
                                            {formatPrice(item.price * item.quantity)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-zinc-200">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted">Subtotal</span>
                                    <span className="text-secondary font-medium">{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted">Shipping</span>
                                    <span className="text-secondary font-medium">{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                                </div>
                                <div className="flex justify-between items-end pt-4" >
                                    <span className="text-secondary font-serif text-xl">Total</span>
                                    <div className="text-right">
                                        <span className="text-xs text-muted block uppercase tracking-widest">NGN</span>
                                        <span className="text-2xl font-bold text-secondary">{formatPrice(total)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-zinc-100 space-y-4">
                                <div className="flex items-center gap-3 text-xs text-secondary/60">
                                    <ShieldCheck size={18} className="text-accent" />
                                    <span>Secure 256-bit SSL encrypted payment</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-secondary/60">
                                    <Truck size={18} className="text-accent" />
                                    <span>Insured delivery with global tracking</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
