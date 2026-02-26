"use client";

import { useTranslation } from "@/lib/i18n";
import { Project } from "@/types/project";
import { motion } from "framer-motion";
import { Maximize2, Box, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProjectCardProps {
    project: Project;
    onClick: () => void;
    index: number;
}

export function ProjectCard({ project, onClick, index }: ProjectCardProps) {
    const { t } = useTranslation();
    const [isHovered, setIsHovered] = useState(false);
    const localizedProject = (t.projects as any)[project.id] || project;

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: index * 0.15, ease: [0.23, 1, 0.32, 1] }}
            className="group relative aspect-[3/4] cursor-none overflow-hidden bg-black border border-white/10 rounded-sm"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            {/* Background Image */}
            <motion.div
                className="absolute inset-0 z-0 opacity-40 group-hover:opacity-70 transition-opacity duration-700"
                animate={{
                    scale: isHovered ? 1.1 : 1,
                }}
            >
                <Image
                    src={project.thumbnail}
                    alt={localizedProject.title}
                    fill
                    className="object-contain p-8 grayscale group-hover:grayscale-0 transition-all duration-700"
                    sizes="(max-width: 1024px) 100vw, 25vw"
                />
            </motion.div>



            {/* Project Info Overlay - Minimalist */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between z-30 pointer-events-none">
                {/* Top Bar - ID REMOVED as requested */}
                <div className="flex justify-end items-start w-full">
                    {/* Indicators Only */}
                    <div className="flex items-center gap-2">
                        {project.type !== "image" && (
                            <div className="flex items-center gap-2 bg-blue-600/20 backdrop-blur-md px-2 py-1 rounded-sm border border-blue-500/30">
                                <Box size={12} className="text-blue-400" />
                                <span className="text-[9px] font-black tracking-widest text-blue-400">{t.common.model3d}</span>
                            </div>
                        )}
                        <span className="flex items-center gap-1 bg-white/5 backdrop-blur-md px-2 py-1 rounded-sm border border-white/10">
                            <Maximize2 size={10} className="text-white/70" />
                            <span className="text-[9px] font-black tracking-widest text-white/70">{t.common.photo}</span>
                        </span>
                    </div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
                    {/* ID / Subtitle Line */}


                    {/* Title */}
                    <div className="mb-8">
                        {localizedProject.prefix && (
                            <span className="block text-[10px] font-black tracking-[0.3em] text-blue-500 uppercase mb-2">
                                {localizedProject.prefix}
                            </span>
                        )}
                        <h3 className="text-3xl md:text-3xl font-black tracking-tighter text-white uppercase leading-none">
                            {localizedProject.title}
                        </h3>
                    </div>

                    {/* Footer / Tech Info */}
                    <div className="flex items-center justify-between border-t border-white/10 pt-6">
                        <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                            {t.common.category || "TECHNOLOGIE"}
                        </span>
                        <div className="p-2 border border-white/10 rounded-sm text-white/50 transition-colors">
                            <ArrowUpRight size={14} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/20 rounded-tl-sm pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/20 rounded-br-sm pointer-events-none" />
        </motion.div>
    );
}
