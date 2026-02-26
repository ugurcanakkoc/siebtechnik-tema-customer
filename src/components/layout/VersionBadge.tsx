"use client";

import { useTranslation } from "@/lib/i18n";
import { motion } from "framer-motion";

export function VersionBadge() {
    const { lang } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed bottom-6 right-6 z-[40] pointer-events-none select-none"
        >
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-sm group">
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black tracking-widest text-white/40 uppercase">
                        {lang.toUpperCase()}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-blue-500" />
                    <span className="text-[9px] font-black tracking-widest text-white/40 uppercase">ENGINEERING V4.0</span>
                </div>
            </div>
        </motion.div>
    );
}
