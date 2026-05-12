"use client";

import Hero from "@/components/layout/Hero";
import FeaturedCategories from "@/components/product/FeaturedCategories";
import FeaturedProducts from "@/components/product/FeaturedProducts";
import { ArrowRight, Sparkles, ShieldCheck, Truck, Loader2, CheckCircle2 } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import { useState } from "react";
import InquiryModal from "@/components/ui/InquiryModal";

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to subscribe");

      setStatus("success");
      setMessage(data.message);
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <Hero />

      {/* Trust Bar */}
      <div className="bg-secondary text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <Sparkles className="text-accent mb-2" size={32} strokeWidth={1} />
            <h3 className="font-serif text-lg tracking-wide">Premium Ingredients</h3>
            <p className="text-white/60 text-xs uppercase tracking-widest leading-loose">Sourced globally for the best results</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck className="text-accent mb-2" size={32} strokeWidth={1} />
            <h3 className="font-serif text-lg tracking-wide">Dermatologist Tested</h3>
            <p className="text-white/60 text-xs uppercase tracking-widest leading-loose">Safe and effective for all skin types</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Truck className="text-accent mb-2" size={32} strokeWidth={1} />
            <h3 className="font-serif text-lg tracking-wide">Fast Shipping</h3>
            <p className="text-white/60 text-xs uppercase tracking-widest leading-loose">Complimentary delivery on orders over ₦75,000</p>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <FeaturedCategories />

      {/* Promotional Section */}
      <section className="relative py-8 px-10 overflow-hidden bg-secondary">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[3/3] rounded-4xl overflow-hidden shadow-premium">
            <SafeImage
              src="/promotional_campaign.png"
              alt="C:\Users\User\OneDrive\Documents\Web Practice\e-commerce cosmetics\public\promotional_campaign.webp"
              fill
              className="object-cover"
              fallbackType="hero"
            />
          </div>
          <div className="max-w-md">
            <span className="text-xs uppercase tracking-[0.3em] text-accent mb-4 block font-bold">In the Spotlight</span>
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight uppercase">Welcome to PMH COSMETICS</h2>
            <p className="text-lg text-white/80 mb-10 leading-relaxed">
              your trusted destination for premium skincare and beauty essentials.
              <br /><br />
              We are currently updating this section of our platform to bring you clearer, more detailed, and valuable information that reflects the quality of our brand.
              <br /><br />
              At PMH COSMETICS, we are built on transparency, authenticity, and excellence. From our shipping process to privacy policies and customer care, our goal is to ensure you enjoy a smooth, safe, and satisfying shopping experience every time.
            </p>
            <button
              onClick={() => setIsInquiryModalOpen(true)}
              className="bg-white text-secondary px-10 py-5 rounded-full text-sm uppercase tracking-widest transition-all duration-300 flex items-center group hover:bg-zinc-100 shadow-md"
            >
              Learn More
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
      />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Newsletter */}
      <section className="py-24 px-6 border-t border-zinc-100" style={{ backgroundColor: '#EDB2B1' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-serif text-secondary mb-6">Join the PMH COSMETICS List</h2>
          <p className="text-muted mb-10 leading-relaxed">
            Be the first to know about new arrivals, private sales, and beauty tips from our experts.
          </p>

          {status === "success" ? (
            <div className="bg-green-50 text-green-700 p-8 rounded-3xl flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
              <CheckCircle2 size={48} />
              <h3 className="text-xl font-serif">{message}</h3>
              <button
                onClick={() => setStatus("idle")}
                className="text-xs uppercase tracking-widest font-bold border-b border-green-700 pb-1 hover:text-green-800 transition-colors"
              >
                Send another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-4 max-w-lg mx-auto">
              <div className="relative flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  disabled={status === "loading"}
                  className="flex-grow border border-zinc-200 px-6 py-4 rounded-full outline-none focus:border-accent transition-colors disabled:opacity-50" style={{ backgroundColor: '#ffffff' }}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-secondary text-white px-8 py-4 rounded-full text-sm uppercase tracking-widest hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 min-w-[140px] disabled:bg-zinc-400"
                >
                  {status === "loading" ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </div>
              {status === "error" && (
                <p className="text-red-500 text-sm mt-2 font-medium">{message}</p>
              )}
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
