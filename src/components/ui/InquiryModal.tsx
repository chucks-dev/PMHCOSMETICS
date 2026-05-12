"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface InquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function InquiryModal({ isOpen, onClose }: InquiryModalProps) {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [responseMessage, setResponseMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const response = await fetch("/api/inquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to send inquiry");

            setStatus("success");
            setResponseMessage(data.message);
            setFormData({ name: "", email: "", message: "" });
        } catch (err: any) {
            setStatus("error");
            setResponseMessage(err.message);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-secondary/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-zinc-400 hover:text-secondary transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="p-8 md:p-12">
                            {status === "success" ? (
                                <div className="text-center py-12">
                                    <div className="bg-green-50 text-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h3 className="text-3xl font-serif text-secondary mb-4">Message Sent</h3>
                                    <p className="text-muted leading-relaxed mb-10">{responseMessage}</p>
                                    <button
                                        onClick={onClose}
                                        className="bg-secondary text-white px-10 py-4 rounded-full text-sm uppercase tracking-widest hover:bg-secondary/90 transition-all font-medium"
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-10">
                                        <span className="text-xs uppercase tracking-[0.3em] text-accent font-bold mb-3 block">Inquiry</span>
                                        <h2 className="text-3xl font-serif text-secondary">Learn More About PMH</h2>
                                        <p className="text-muted text-sm mt-2">Leave a message and our team will get back to you shortly.</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-secondary px-4">Full Name</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="John Doe"
                                                className="w-full bg-zinc-50 border border-zinc-100 px-6 py-4 rounded-2xl outline-none focus:border-accent transition-colors"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-secondary px-4">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="john@example.com"
                                                className="w-full bg-zinc-50 border border-zinc-100 px-6 py-4 rounded-2xl outline-none focus:border-accent transition-colors"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-secondary px-4">Message</label>
                                            <textarea
                                                required
                                                rows={4}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                placeholder="How can we help you?"
                                                className="w-full bg-zinc-50 border border-zinc-100 px-6 py-4 rounded-2xl outline-none focus:border-accent transition-colors resize-none"
                                            />
                                        </div>

                                        {status === "error" && (
                                            <p className="text-red-500 text-sm font-medium px-4">{responseMessage}</p>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={status === "loading"}
                                            className="w-full bg-secondary text-white py-5 rounded-full text-sm uppercase tracking-widest font-bold hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 disabled:bg-zinc-400 group"
                                        >
                                            {status === "loading" ? (
                                                <Loader2 className="animate-spin" size={20} />
                                            ) : (
                                                <>
                                                    Send Message
                                                    <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
