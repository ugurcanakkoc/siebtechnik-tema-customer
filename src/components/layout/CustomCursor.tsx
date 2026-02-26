"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

export function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false);

    // Direct motion values for 1:1 movement (no lag)
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseleave", handleMouseLeave);
        document.addEventListener("mouseenter", handleMouseEnter);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mouseenter", handleMouseEnter);
        };
    }, [isVisible, mouseX, mouseY]);

    if (typeof window === "undefined") return null;

    return (
        <>
            {/* Minimal Dot - Instant Feedback, No distraction */}
            <motion.div
                className="custom-cursor-dot hidden md:block !pointer-events-none"
                style={{
                    left: mouseX,
                    top: mouseY,
                    opacity: isVisible ? 1 : 0,
                    zIndex: 1000000
                }}
            />
            {/* Small reactive ring */}
            <motion.div
                className="custom-cursor hidden md:flex !pointer-events-none"
                style={{
                    left: mouseX,
                    top: mouseY,
                    opacity: isVisible ? 0.4 : 0,
                    width: '20px',
                    height: '20px',
                    zIndex: 999999
                }}
            />
        </>
    );
}
