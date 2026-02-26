"use client";

import { useParams, useRouter } from "next/navigation";
import { projects } from "@/data/projects";
import dynamic from "next/dynamic";
import { X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

// Dynamically load the 3D viewer to avoid SSR issues with Three.js
const RoomViewer = dynamic(() => import("@/components/gallery/RoomViewer"), {
    ssr: false,
    loading: () => {
        const { t } = useTranslation();
        return (
            <div className="w-full h-screen bg-[#050505] flex flex-col items-center justify-center text-white gap-4">
                <div className="w-16 h-16 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-blue-400 font-medium animate-pulse uppercase tracking-widest text-xs">{t.viewer.simulationLoading || "Simulation wird vorbereitet..."}</p>
            </div>
        );
    }
});

export default function ThreeDExperiencePage() {
    const { t } = useTranslation();
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const project = projects.find(p => p.id === id);

    if (!project || !project.modelUrl) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">{t.viewer.modelNotFound}</h1>
                    <Link href="/" className="text-blue-400 hover:underline">{t.viewer.backToDashboard}</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black">
            {/* Header / Exit */}
            <div className="absolute top-0 left-0 right-0 z-[110] p-6 flex justify-between items-start pointer-events-none">
                <div className="flex flex-col pointer-events-auto">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group mb-2"
                    >
                        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                        <span className="text-sm font-medium">{t.viewer.back}</span>
                    </button>
                    {((t.projects as any)[id] as any)?.prefix && (
                        <span className="text-[10px] font-black tracking-[0.2em] text-blue-500 uppercase mb-1">
                            {((t.projects as any)[id] as any).prefix}
                        </span>
                    )}
                    <h1 className="text-xl font-bold text-white uppercase tracking-tight">{(t.projects as any)[id]?.title || project.title}</h1>
                    <p className="text-xs text-white/40 tracking-wider font-medium opacity-50">WALKTHROUGH EXPERIENCE</p>
                </div>

                <button
                    onClick={() => router.back()}
                    className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all pointer-events-auto border border-white/10"
                    title={t.viewer.exit}
                >
                    <X size={24} />
                </button>
            </div>

            {/* The 3D Room */}
            <RoomViewer modelUrl={project.modelUrl} />

            {/* Help / Footer */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[110] pointer-events-none">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-8 shadow-2xl">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                            <span className="w-6 h-6 bg-white/10 rounded flex items-center justify-center text-[10px] text-white/80 border border-white/10 font-mono">W</span>
                            <span className="w-6 h-6 bg-white/10 rounded flex items-center justify-center text-[10px] text-white/80 border border-white/10 font-mono">A</span>
                            <span className="w-6 h-6 bg-white/10 rounded flex items-center justify-center text-[10px] text-white/80 border border-white/10 font-mono">S</span>
                            <span className="w-6 h-6 bg-white/10 rounded flex items-center justify-center text-[10px] text-white/80 border border-white/10 font-mono">D</span>
                        </div>
                        <span className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">{t.viewer.controls.move}</span>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-3 text-white/40 uppercase font-bold tracking-tighter text-[10px]">
                        <div className="w-10 h-6 bg-white/10 rounded border border-white/10 flex items-center justify-center font-mono">ESC</div>
                        <span>{t.viewer.exit}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
