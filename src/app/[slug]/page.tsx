import Link from "next/link";

export default async function GenericPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const title = slug?.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") || "Page";

    return (
        <div className="pt-40 pb-24" style={{ backgroundColor: '#EDB2B1' }}>
            <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
                <span className="text-xs uppercase tracking-[0.4em] text-accent mb-4 block font-bold">Information</span>
                <h1 className="text-4xl md:text-6xl font-serif text-secondary mb-8">Our Vision</h1>
                <div className="prose prose-zinc max-w-none text-muted leading-relaxed text-left">
                    <p className="mb-6">
                        Our vision is to become a leading and trusted skincare brand known for offering only original, authentic, and high-quality skincare products at the best possible prices.

                        We are committed to making skincare accessible to everyone, helping our customers shop with confidence, peace of mind, and complete trust in every product they purchase.
                    </p>
                    <p className="mb-6">
                        At PMH COSMETICS, we believe in transparency and excellence. Whether it's our shipping policies,
                        privacy terms, or our brand story, we strive to deliver a seamless experience.
                    </p>
                    <div className="bg-primary/10 p-8 rounded-3xl border border-zinc-100 my-12">
                        <h3 className="text-xl font-serif text-secondary mb-4 italic">"Beauty is in the details."</h3>
                        <p className="text-sm">Stay tuned for the full release of this section.</p>
                    </div>
                </div>
                <Link
                    href="/products"
                    className="inline-block bg-secondary text-white px-10 py-4 rounded-full text-sm uppercase tracking-widest hover:bg-secondary/90 transition-all font-medium mt-8"
                >
                    Return to Shopping
                </Link>
            </div>
        </div>
    );
}
