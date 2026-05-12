import Link from "next/link";
import { Instagram, Facebook, Mail } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-secondary text-white py-16 px-6 md:px-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-1">
                    <Link href="/" className="inline-block mb-6">
                        <span className="text-3xl font-serif tracking-widest font-bold">PMH COSMETICS</span>
                    </Link>
                    <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
                        Curating the finest in global beauty, skincare, and luxury fragrance.
                        Elevate your daily ritual with our handpicked selections.
                    </p>
                    <div className="flex space-x-4">
                        <a href="https://www.instagram.com/p.m.h_skincare?igsh=MWI4eGN5d2Nkd3Z4aQ==" className="hover:text-accent transition-colors"><Instagram size={20} strokeWidth={1.5} /></a>
                        <a href="https://www.facebook.com/share/18PZpn8ky3/" className="hover:text-accent transition-colors"><Facebook size={20} strokeWidth={1.5} /></a>
                        <a href="https://www.tiktok.com/@pmh.cosmetics.ng?_r=1&_t=ZS-93idgk1KhFM" className="hover:text-accent transition-colors">
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                            </svg>
                        </a>
                        <a href="https://wa.me/2348122881797" className="hover:text-accent transition-colors">
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-serif mb-6 uppercase tracking-widest">Shop</h4>
                    <ul className="space-y-4 text-white/60 text-sm">
                        <li><Link href="/category/skincare" className="hover:text-white transition-colors">Skincare</Link></li>

                        <li><Link href="/category/fragrance" className="hover:text-white transition-colors">Fragrance</Link></li>
                        <li><Link href="/new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-lg font-serif mb-6 uppercase tracking-widest">Support</h4>
                    <ul className="space-y-4 text-white/60 text-sm">
                        <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                        <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
                        <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                        <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-lg font-serif mb-6 uppercase tracking-widest">Join our list</h4>
                    <p className="text-white/60 text-sm mb-6">
                        Subscribe to receive updates, access to exclusive deals, and more.
                    </p>
                    <div className="flex items-center bg-white rounded-full px-5 py-3 gap-3">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-transparent border-none outline-none text-sm flex-grow placeholder:text-zinc-400 text-secondary"
                        />
                        <button className="text-secondary/60 hover:text-accent transition-colors">
                            <Mail size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:row justify-between items-center text-[10px] tracking-widest uppercase text-white/40">
                <p>© {currentYear} PMH COSMETICS. ALL RIGHTS RESERVED.</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <span>Terms of Service</span>
                    <span>Refund Policy</span>
                </div>
            </div>
        </footer>
    );
}
