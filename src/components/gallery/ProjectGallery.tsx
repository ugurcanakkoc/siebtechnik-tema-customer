"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import { Project } from "@/types/project";
import { ProjectCard } from "./ProjectCard";
import { ThreeDViewer } from "./ThreeDViewer";
import { AnimatePresence } from "framer-motion";
import { Box, X } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface ProjectGalleryProps {
    projects: Project[];
}

export function ProjectGallery({ projects }: ProjectGalleryProps) {
    const { t } = useTranslation();
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    const [show3D, setShow3D] = useState(false);

    const openLightbox = (project: Project) => {
        setActiveProject(project);
        setLightboxOpen(true);
    };

    return (
        <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 h-full">
                {projects.map((project, idx) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        index={idx}
                        onClick={() => openLightbox(project)}
                    />
                ))}
            </div>

            {activeProject && (
                <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    slides={activeProject.images.map((src) => ({ src }))}
                    plugins={[Zoom, Captions, Thumbnails]}
                    carousel={{ finite: false }}
                    styles={{
                        container: { backgroundColor: "rgba(0, 0, 0, .98)", backdropFilter: "blur(20px)" },
                        root: { zIndex: 99999 }
                    }}
                    render={{
                        buttonClose: () => null,
                    }}
                    zoom={{
                        maxZoomPixelRatio: 3,
                        scrollToZoom: true,
                    }}
                    thumbnails={{
                        position: "bottom",
                        width: 140,
                        height: 90,
                        gap: 20,
                        padding: 30,
                        imageFit: "contain",
                        vignette: true,
                    }}
                    toolbar={{
                        buttons: [
                            <button
                                key="3d-button"
                                type="button"
                                onClick={() => {
                                    setShow3D(true);
                                    setLightboxOpen(false);
                                }}
                                className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 m-2 rounded-sm transition-all active:scale-95 shadow-lg shadow-blue-600/30 border border-blue-400/50"
                                style={{ display: activeProject.modelUrl ? 'flex' : 'none' }}
                            >
                                <Box size={20} />
                                <span className="text-xs font-black tracking-[0.2em] uppercase">{t.common.model3d}</span>
                            </button>,
                            // Standardized Close Button (Matches ThreeDViewer)
                            <button
                                key="close-button"
                                type="button"
                                onClick={() => setLightboxOpen(false)}
                                className="w-14 h-14 flex items-center justify-center bg-white/5 hover:bg-red-600 rounded-sm transition-all text-white border border-white/10 active:scale-95 group cursor-pointer m-2 backdrop-blur-md"
                                title={t.viewer.controls.close}
                            >
                                <X size={32} className="group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        ],
                    }}
                />
            )}

            <AnimatePresence>
                {show3D && activeProject?.modelUrl && (
                    <ThreeDViewer
                        src={activeProject.modelUrl}
                        onClose={() => {
                            setShow3D(false);
                            setLightboxOpen(true);
                        }}
                        title={(t.projects as any)[activeProject.id]?.title || activeProject.title}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
