"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, RotateCcw, AlertCircle, Box, Info, MousePointer2, Hand, Rotate3d, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

interface ThreeDViewerProps {
    src: string;
    onClose: () => void;
    title?: string;
}

export function ThreeDViewer({ src, onClose, title }: ThreeDViewerProps) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [prefix, setPrefix] = useState<string | null>(null);
    const [currentTitle, setCurrentTitle] = useState(title);
    const [mounted, setMounted] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [autoRotate, setAutoRotate] = useState(false); // Default to false (stable)
    const viewerRef = useRef<any>(null);

    useEffect(() => {
        setMounted(true);
        document.body.style.overflow = 'hidden';
        return () => {
            setMounted(false);
            document.body.style.overflow = 'unset';
        };
    }, []);

    const moveCamera = (dir: 'up' | 'down' | 'left' | 'right' | 'reset') => {
        if (!viewerRef.current) return;
        const orbit = viewerRef.current.getCameraOrbit();
        let theta = orbit.theta;
        let phi = orbit.phi;
        let radius = orbit.radius;
        const step = 0.3;
        if (dir === 'reset') {
            viewerRef.current.cameraOrbit = "0deg 75deg 105%";
            return;
        }
        if (dir === 'left') theta -= step;
        if (dir === 'right') theta += step;
        if (dir === 'up') phi -= step;
        if (dir === 'down') phi += step;
        phi = Math.max(0.01, Math.min(Math.PI - 0.01, phi));
        viewerRef.current.cameraOrbit = `${theta}rad ${phi}rad ${radius}m`;
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);

        const viewer = viewerRef.current;
        if (!viewer) return;

        const handleLoad = () => {
            setLoading(false);
            setError(null);
        };

        const handleError = (err: any) => {
            console.error("3D Model Load Error:", err);
            setError(t.common.brand + " - " + t.viewer.error);
            setLoading(false);
        };

        viewer.addEventListener('load', handleLoad);
        viewer.addEventListener('error', handleError);

        // Initialize title and prefix based on translations
        const projectData = Object.entries(t.projects as any).find(([id, data]: any) => data.title === title || id === title);
        if (projectData) {
            const [_, data]: [string, any] = projectData;
            setPrefix(data.prefix);
            setCurrentTitle(data.title);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            if (viewer) {
                viewer.removeEventListener('load', handleLoad);
                viewer.removeEventListener('error', handleError);
            }
        };
    }, [src, t.common.brand, t.viewer.error, onClose, mounted, title, t.projects]);

    if (!mounted) return null;

    const viewerContent = (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black"
        >
            {/* Header Area Inside the Window */}
            <div className="absolute top-0 left-0 right-0 z-[100] bg-black/60 border-b border-white/10 backdrop-blur-xl md:px-10 px-6 py-6 flex items-center justify-between">
                <div className="flex flex-col">
                    {prefix && (
                        <span className="text-blue-500 font-black text-[9px] uppercase tracking-[0.4em] mb-0.5 opacity-80">{prefix}</span>
                    )}
                    <h4 className="text-white font-black text-xl md:text-2xl tracking-tighter uppercase leading-tight">{currentTitle}</h4>
                </div>

                <div className="flex items-center gap-6">
                    {/* Interaction Help Toggle */}
                    <button
                        onClick={() => setShowHelp(!showHelp)}
                        className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-sm border transition-all ${showHelp ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-white/5 border-white/10 text-white/60 hover:text-white'}`}
                    >
                        <Info size={16} />
                        <span className="text-[10px] font-black tracking-widest uppercase">{t.viewer.controls.title}</span>
                    </button>

                    {/* Auto Rotate Toggle */}
                    <button
                        onClick={() => setAutoRotate(!autoRotate)}
                        className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-sm border transition-all ${autoRotate ? 'bg-green-600/20 border-green-500 text-green-400' : 'bg-white/5 border-white/10 text-white/60 hover:text-white'}`}
                    >
                        {autoRotate ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                        <span className="text-[10px] font-black tracking-widest uppercase">{autoRotate ? t.viewer.controls.autoRotate : t.viewer.controls.static}</span>
                    </button>

                    <div className="w-px h-8 bg-white/10 hidden md:block" />

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onClose();
                        }}
                        className="w-14 h-14 flex items-center justify-center bg-white/5 hover:bg-red-600 rounded-sm transition-all text-white border border-white/10 active:scale-95 group cursor-pointer"
                        title={t.viewer.controls.close}
                    >
                        <X size={32} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>
            </div>

            {/* Help Overlay - Shows instructions clearly */}
            <AnimatePresence>
                {showHelp && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-[100px] right-6 md:right-32 z-[90] bg-black/80 backdrop-blur-xl border border-white/10 p-6 rounded-sm max-w-sm w-full shadow-2xl"
                    >
                        <h5 className="text-white font-black uppercase tracking-widest text-xs mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                            <MousePointer2 size={14} className="text-blue-500" />
                            {t.viewer.help.title}
                        </h5>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-sm bg-white/10 flex items-center justify-center border border-white/5">
                                    <Rotate3d size={16} className="text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">{t.viewer.help.rotate}</span>
                                    <span className="text-xs text-neutral-400">{t.viewer.help.rotateDesc}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-sm bg-white/10 flex items-center justify-center border border-white/5">
                                    <Hand size={16} className="text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">{t.viewer.help.pan}</span>
                                    <span className="text-xs text-neutral-400">{t.viewer.help.panDesc}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-sm bg-white/10 flex items-center justify-center border border-white/5">
                                    <ChevronUp size={16} className="text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">{t.viewer.help.zoom}</span>
                                    <span className="text-xs text-neutral-400">{t.viewer.help.zoomDesc}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="w-full h-full relative pt-24">
                {loading && !error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-6 z-10 bg-black">
                        <Loader2 className="animate-spin text-blue-500" size={48} />
                        <span className="text-[10px] font-black tracking-[0.4em] text-blue-500 uppercase">{t.common.loading}</span>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-4 z-20 bg-black p-6 text-center">
                        <AlertCircle className="text-red-500" size={64} />
                        <h2 className="text-2xl font-black uppercase tracking-tighter">ERROR</h2>
                        <p className="text-sm font-medium text-white/40 uppercase tracking-widest">{error}</p>
                    </div>
                )}

                {/* Simplified Controls */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 bg-black/40 px-6 py-4 rounded-sm backdrop-blur-md border border-white/10">
                    <button onClick={() => moveCamera('left')} className="p-3 hover:bg-white/10 rounded-sm text-white transition-colors"><ChevronLeft size={20} /></button>
                    <div className="flex flex-col gap-1">
                        <button onClick={() => moveCamera('up')} className="p-3 hover:bg-white/10 rounded-sm text-white transition-colors"><ChevronUp size={20} /></button>
                        <button onClick={() => moveCamera('down')} className="p-3 hover:bg-white/10 rounded-sm text-white transition-colors"><ChevronDown size={20} /></button>
                    </div>
                    <button onClick={() => moveCamera('right')} className="p-3 hover:bg-white/10 rounded-sm text-white transition-colors"><ChevronRight size={20} /></button>
                    <div className="w-px h-10 bg-white/10 mx-2" />
                    <button onClick={() => moveCamera('reset')} className="p-3 bg-blue-600 hover:bg-blue-500 rounded-sm text-white transition-all flex items-center gap-2">
                        <RotateCcw size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">{t.viewer.controls.reset}</span>
                    </button>

                    {/* Mobile Only Help Trigger */}
                    <div className="w-px h-10 bg-white/10 mx-2 md:hidden" />
                    <button onClick={() => setShowHelp(!showHelp)} className="md:hidden p-3 bg-white/10 hover:bg-white/20 rounded-sm text-white transition-all">
                        <Info size={20} className={showHelp ? "text-blue-400" : "text-white"} />
                    </button>
                </div>

                {(() => {
                    const ModelViewer = 'model-viewer' as any;
                    return (
                        <ModelViewer
                            ref={viewerRef}
                            src={src}
                            alt={title || t.viewer.alt}
                            camera-controls
                            interaction-prompt="none"
                            shadow-intensity="1"
                            environment-image="neutral"
                            exposure="1.2"
                            loading="eager"
                            camera-target="auto auto auto"
                            autoplay={autoRotate ? "true" : undefined}
                            auto-rotate={autoRotate ? "true" : undefined}
                            style={{
                                width: "100%",
                                height: "100%",
                                backgroundColor: "transparent",
                            }}
                        >
                            <div slot="progress-bar" className="hidden"></div>
                        </ModelViewer>
                    );
                })()}
            </div>
        </motion.div>
    );

    return createPortal(viewerContent, document.body);
}
