"use client";

import { useEffect, useState, useRef } from "react";
import Script from "next/script";
import { X, Loader2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, RotateCcw, Upload, FileCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

interface ModelSandboxProps {
    onClose: () => void;
}

export function ModelSandbox({ onClose }: ModelSandboxProps) {
    const { t, lang } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [modelSrc, setModelSrc] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const viewerRef = useRef<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.glb')) {
            alert(t.viewer.sandbox.onlyGlb);
            return;
        }

        setLoading(true);
        setFileName(file.name);

        const url = URL.createObjectURL(file);
        setModelSrc(url);
    };

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

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10"
        >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-6xl h-[85vh] bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
            >
                <Script
                    src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
                    type="module"
                    crossOrigin="anonymous"
                />

                {/* Header */}
                <div className="flex items-center justify-between p-6 bg-black/50 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                            <FileCode className="text-blue-500" size={20} />
                        </div>
                        <div>
                            <h3 className="text-white font-bold tracking-tight">{t.viewer.sandbox.title}</h3>
                            <p className="text-white/40 text-[10px] uppercase tracking-widest leading-none mt-1">
                                {fileName || t.viewer.sandbox.noFile}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                        >
                            <Upload size={16} />
                            {t.viewer.sandbox.upload}
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept=".glb"
                            className="hidden"
                        />
                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl text-white transition-colors border border-white/10"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 relative flex">
                    {/* Viewer Side */}
                    <div className="flex-1 relative">
                        {!modelSrc && !loading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 p-10 text-center">
                                <Upload size={64} className="mb-6 opacity-20" />
                                <h4 className="text-xl font-medium mb-2 opacity-50 text-white">{t.viewer.simulationReady}</h4>
                                <p className="max-w-xs text-sm">{lang === 'en' ? 'Please select the .glb file you want to examine from the button above.' : 'Bitte wählen Sie die .glb-Datei, die Sie untersuchen möchten, über die Schaltfläche oben aus.'}</p>
                            </div>
                        )}

                        {loading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-4 z-30 bg-[#0a0a0a]">
                                <Loader2 className="animate-spin text-blue-500" size={48} />
                                <span className="text-sm font-bold tracking-widest text-blue-400">{t.viewer.modelProcessing}</span>
                            </div>
                        )}

                        {modelSrc && (
                            <div className="w-full h-full">
                                {(() => {
                                    const ModelViewer = 'model-viewer' as any;
                                    return (
                                        <ModelViewer
                                            ref={viewerRef}
                                            src={modelSrc}
                                            alt="Sandbox Model"
                                            camera-controls
                                            interaction-prompt="none"
                                            shadow-intensity="1"
                                            environment-image="neutral"
                                            exposure="1"
                                            loading="eager"
                                            camera-target="auto auto auto"
                                            bounds="tight"
                                            onload={() => setLoading(false)}
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

                                {/* Tools Overlay */}
                                <div className="absolute bottom-6 left-6 z-40 flex flex-col items-center gap-1 bg-black/60 p-3 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl">
                                    <button onClick={() => moveCamera('up')} className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors"><ChevronUp size={20} /></button>
                                    <div className="flex gap-1">
                                        <button onClick={() => moveCamera('left')} className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors"><ChevronLeft size={20} /></button>
                                        <button onClick={() => moveCamera('reset')} className="p-2 bg-blue-600/40 hover:bg-blue-600 rounded-lg text-white transition-colors shadow-lg shadow-blue-600/20"><RotateCcw size={16} /></button>
                                        <button onClick={() => moveCamera('right')} className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors"><ChevronRight size={20} /></button>
                                    </div>
                                    <button onClick={() => moveCamera('down')} className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors"><ChevronDown size={20} /></button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Info */}
                    <div className="w-80 border-l border-white/5 bg-black/30 p-8 hidden lg:flex flex-col gap-8">
                        <div>
                            <h4 className="text-xs font-black text-white px-2 py-1 bg-white/5 rounded w-fit mb-4">{t.viewer.sandbox.fileInfo}</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">{t.viewer.sandbox.fileName}</p>
                                    <p className="text-sm text-white/80 font-mono truncate">{fileName || "---"}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">{t.viewer.sandbox.format}</p>
                                    <p className="text-sm text-white/80 font-mono">glTF 2.0 Binary (.glb)</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-black text-white px-2 py-1 bg-white/5 rounded w-fit mb-4">{t.viewer.sandbox.controls}</h4>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-xs text-white/40">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                    {t.viewer.sandbox.mouse}
                                </li>
                                <li className="flex items-center gap-3 text-xs text-white/40">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                    {t.viewer.sandbox.scroll}
                                </li>
                                <li className="flex items-center gap-3 text-xs text-white/40">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                    {t.viewer.sandbox.pan}
                                </li>
                            </ul>
                        </div>

                        <div className="mt-auto bg-blue-600/5 p-4 rounded-2xl border border-blue-500/10">
                            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest leading-relaxed">
                                {t.viewer.sandbox.sandboxDesc}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 text-center text-white/20 text-[9px] uppercase tracking-[0.4em] font-medium bg-black/50 border-t border-white/5">
                    Industrial Visualizer Sandbox v2.0
                </div>
            </motion.div>
        </motion.div>
    );
}
