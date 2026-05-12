"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface SafeImageProps extends ImageProps {
    fallbackType?: 'product' | 'category' | 'hero';
}

export default function SafeImage({ src, alt, fallbackType = 'product', ...props }: SafeImageProps) {
    const [error, setError] = useState(false);

    // Generate a premium-looking placeholder based on type
    const getPlaceholder = () => {
        const colors = {
            product: 'fdf0f0', // soft pink
            category: '2d2d2d', // charcoal
            hero: 'fdf0f0'     // soft pink
        };
        const textColor = fallbackType === 'category' ? 'ffffff' : '2d2d2d';
        return `https://placehold.co/800x800/${colors[fallbackType]}/${textColor}?text=${encodeURIComponent(alt || 'PMH COSMETICS')}`;
    };

    return (
        <Image
            {...props}
            src={error ? getPlaceholder() : src}
            alt={alt}
            onError={() => setError(true)}
        />
    );
}
