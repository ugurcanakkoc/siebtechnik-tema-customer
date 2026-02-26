"use client";

import { ProjectGallery } from "@/components/gallery/ProjectGallery";
import { projects } from "@/data/projects";
import { useEffect } from "react";
import { Cpu, Zap, Globe, Cpu as AI, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { Counter } from "@/components/ui/Counter";
import Link from 'next/link';

export default function Home() {
  const { t } = useTranslation();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col pt-[120px] md:pt-[160px]">

      <div className="flex-grow flex flex-col px-6 md:px-12 z-10 max-w-[1850px] mx-auto w-full relative">

        {/* Spacing for removed badge */}
        <div className="mb-4"></div>

        {/* Brand Presence */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end py-12 md:py-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col gap-8 md:gap-10"
          >
            <div className="flex items-center gap-3">
              <span className="w-12 h-[1px] bg-blue-500" />
              <span className="luxury-heading text-[10px] md:text-xs tracking-[0.6em]">{t.common.brand}</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.8] text-gradient">
              {t.common.excellence}<br />
              <span className="text-white">{t.common.precision}</span>
            </h1>
            <p className="max-w-2xl text-neutral-400 text-sm md:text-base leading-relaxed font-medium uppercase tracking-widest border-l-2 border-white/10 pl-6">
              {t.home.heroDesc}
            </p>
          </motion.div>

          {/* Revised Tagline Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:flex flex-col items-end text-right border-r-2 border-blue-500 pr-8 py-2"
          >
            <span className="text-xs text-blue-500 font-black tracking-widest uppercase">{t.home.taglineSmall}</span>
            <span className="text-2xl text-white font-black tracking-tighter uppercase mt-1">{t.home.taglineBig}</span>
          </motion.div>
        </div>

        {/* Strategic Values Bar - Consolidated with Animated Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 border-y border-white/10 py-12">

          {/* 200+ -> Annual Capacity */}
          <div className="flex items-center gap-6 group">
            {/* Removed box container, kept size/centering for alignment but transparent */}
            <div className="flex items-center justify-center flex-shrink-0 min-w-[5rem]">
              <span className="text-5xl md:text-6xl font-black text-white group-hover:text-blue-500 transition-colors tabular-nums tracking-tighter">
                <Counter value={t.home.stats.panels.value} suffix={t.home.stats.panels.suffix} />
              </span>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <h4 className="text-sm font-black uppercase tracking-widest text-white leading-none">{t.home.highlights.smartControl}</h4>
              <p className="text-[10px] text-neutral-500 font-medium tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity">{t.home.highlights.smartControlDesc}</p>
            </div>
          </div>

          {/* 20+ -> Experience */}
          <div className="flex items-center gap-6 group">
            <div className="flex items-center justify-center flex-shrink-0 min-w-[5rem]">
              <span className="text-5xl md:text-6xl font-black text-white group-hover:text-blue-500 transition-colors tabular-nums tracking-tighter">
                <Counter value={t.home.stats.experience.value} suffix={t.home.stats.experience.suffix} />
              </span>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <h4 className="text-sm font-black uppercase tracking-widest text-white leading-none">{t.home.highlights.safety}</h4>
              <p className="text-[10px] text-neutral-500 font-medium tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity">{t.home.highlights.safetyDesc}</p>
            </div>
          </div>

          {/* 100% -> Digital Workflow */}
          <div className="flex items-center gap-6 group">
            <div className="flex items-center justify-center flex-shrink-0 min-w-[5rem]">
              <span className="text-5xl md:text-6xl font-black text-white group-hover:text-blue-500 transition-colors tabular-nums tracking-tighter">
                <Counter value={t.home.stats.digital.value} suffix={t.home.stats.digital.suffix} />
              </span>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <h4 className="text-sm font-black uppercase tracking-widest text-white leading-none">{t.home.highlights.efficiency}</h4>
              <p className="text-[10px] text-neutral-500 font-medium tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity">{t.home.highlights.efficiencyDesc}</p>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="flex-grow mb-24">
          <ProjectGallery projects={projects} />
        </div>

        {/* CTA Only */}
        <div className="flex justify-end mb-24 max-w-4xl ml-auto">
          <div className="flex flex-col items-end text-right gap-6">
            <p className="text-lg md:text-xl font-medium text-white/90 leading-relaxed">
              {t.home.cta}
            </p>
            <a
              href="mailto:hasan.uzun@uvp-schaltschrankbau.de"
              className="group flex items-center gap-4 bg-white text-black px-8 py-4 rounded-sm font-black tracking-widest uppercase hover:bg-blue-600 hover:text-white transition-all transform hover:translate-x-2"
            >
              {t.common.brand} / {t.common.contact}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Footer Signature */}
        <div className="pb-12 border-t border-white/10 pt-12">
          <div className="text-[9px] text-neutral-500 tracking-[0.6em] font-black uppercase text-center md:text-right">
            &copy; {new Date().getFullYear()} {t.common.brand} GMBH | {t.common.allRights}
          </div>
        </div>
      </div>
    </div>
  );
}
