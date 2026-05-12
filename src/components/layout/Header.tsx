"use client";

import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import SafeImage from "@/components/ui/SafeImage";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { cartCount } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Skincare", href: "/category/skincare" },

        { name: "Fragrance", href: "/category/fragrance" },
        { name: "About", href: "/about" },
    ];

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-12",
                isScrolled ? "backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-6"
            )}
            style={isScrolled ? { backgroundColor: 'rgba(237, 178, 177, 0.85)' } : undefined}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Mobile menu toggle */}
                <button
                    className={cn(
                        "md:hidden transition-colors duration-300",
                        isScrolled ? "text-secondary" : "text-white"
                    )}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <span className={cn(
                        "text-2xl font-serif tracking-widest font-bold transition-colors duration-300",
                        isScrolled ? "text-secondary" : "text-white"
                    )}>
                        PMH COSMETICS
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "text-sm uppercase tracking-widest transition-colors duration-300",
                                isScrolled ? "text-secondary/70 hover:text-accent" : "text-white/80 hover:text-white"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Icons */}
                <div className={cn(
                    "flex items-center space-x-5 transition-colors duration-300",
                    isScrolled ? "text-secondary" : "text-white"
                )}>
                    <button className="hover:text-accent transition-colors duration-300">
                        <Search size={20} strokeWidth={1.5} />
                    </button>
                    
                    <Link href="/cart" className="hover:text-accent transition-colors duration-300 relative">
                        <ShoppingBag size={20} strokeWidth={1.5} />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-in zoom-in duration-300">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={cn(
                    "fixed inset-0 z-40 transition-transform duration-500 md:hidden flex flex-col items-center justify-center space-y-8",
                    isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                )}
                style={{ backgroundColor: '#EDB2B1' }}
            >
                <button
                    className="absolute top-6 right-6 text-secondary"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <X size={32} />
                </button>
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className="text-2xl font-serif tracking-widest text-secondary"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>
        </header>
    );
}
