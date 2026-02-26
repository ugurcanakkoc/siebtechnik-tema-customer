"use client";

import { useEffect, useRef, useState } from "react";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import { Move, MousePointer2, X } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface RoomViewerProps {
    modelUrl: string;
}

export default function RoomViewer({ modelUrl }: RoomViewerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { t, lang } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        if (!canvasRef.current) return;

        const engine = new BABYLON.Engine(canvasRef.current, true, {
            preserveDrawingBuffer: true,
            stencil: true,
            disableWebGL2Support: false,
        });

        // Configure Draco Decoder
        const DRACO_URL = "https://www.gstatic.com/draco/versioned/decoders/1.5.7/";
        BABYLON.DracoCompression.Configuration = {
            decoder: {
                wasmUrl: `${DRACO_URL}draco_decoder_wasm.wasm`,
                wasmBinaryUrl: `${DRACO_URL}draco_decoder_wasm.js`,
                fallbackUrl: `${DRACO_URL}draco_wasm_wrapper.js`,
            }
        };

        const scene = new BABYLON.Scene(engine);

        // Professional Environment
        const envHelper = scene.createDefaultEnvironment({
            createGround: true,
            groundSize: 100,
            groundColor: new BABYLON.Color3(0.05, 0.05, 0.05),
            createSkybox: true,
            skyboxColor: new BABYLON.Color3(0.01, 0.01, 0.01),
            enableGroundShadow: true,
        });

        // Camera Setup (Standard WASD + Mouse)
        const camera = new BABYLON.UniversalCamera("MainCamera", new BABYLON.Vector3(0, 1.7, 10), scene);
        camera.setTarget(BABYLON.Vector3.Zero());

        // WASD Controls
        camera.keysUp.push(87);    // W
        camera.keysDown.push(83);  // S
        camera.keysLeft.push(65);  // A
        camera.keysRight.push(68); // D

        camera.speed = 0.5;
        camera.angularSensibility = 2000;
        camera.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5); // Player size for collisions
        camera.checkCollisions = true;
        scene.collisionsEnabled = true;

        if (envHelper && envHelper.ground) {
            envHelper.ground.checkCollisions = true;
        }

        // Lighting
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;

        const dirLight = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
        dirLight.position = new BABYLON.Vector3(20, 40, 20);
        dirLight.intensity = 0.5;

        // Model Loading
        BABYLON.SceneLoader.AppendAsync("", modelUrl, scene, (evt) => {
            if (evt.lengthComputable) {
                setProgress(Math.round((evt.loaded * 100) / evt.total));
            }
        }).then(() => {
            setIsLoading(false);

            // Auto-center the model
            const meshes = scene.meshes;
            const root = new BABYLON.Mesh("root", scene);
            meshes.forEach(m => {
                if (!m.parent && m !== root && m.name !== "ground" && m.name !== "skybox") {
                    m.setParent(root);
                }
            });

            // Get bounding box of all loaded meshes
            const hierarchy = root.getHierarchyBoundingVectors();
            const center = hierarchy.max.add(hierarchy.min).scale(0.5);

            root.position.x -= center.x;
            root.position.z -= center.z;
            root.position.y -= hierarchy.min.y; // Sit on floor
        }).catch(err => {
            console.error("Babylon Error:", err);
        });

        // Click to Teleport / Focus
        scene.onPointerDown = (evt, pickResult) => {
            if (pickResult.hit && pickResult.pickedMesh && pickResult.pickedMesh.name === "ground") {
                const target = pickResult.pickedPoint;
                if (target) {
                    BABYLON.Animation.CreateAndStartAnimation(
                        "teleport",
                        camera,
                        "position",
                        60,
                        30,
                        camera.position,
                        new BABYLON.Vector3(target.x, 1.7, target.z),
                        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
                    );
                }
            }
        };

        // Resize
        window.addEventListener("resize", () => {
            engine.resize();
        });

        engine.runRenderLoop(() => {
            scene.render();
        });

        // Pointer Lock / Input management
        const handleLock = () => {
            if (document.pointerLockElement === canvasRef.current) {
                setIsLocked(true);
                camera.attachControl(canvasRef.current, true);
            } else {
                setIsLocked(false);
                camera.detachControl();
            }
        };
        document.addEventListener("pointerlockchange", handleLock);

        return () => {
            document.removeEventListener("pointerlockchange", handleLock);
            engine.dispose();
        };
    }, [modelUrl]);

    return (
        <div className="w-full h-full bg-black relative">
            <canvas
                ref={canvasRef}
                className="w-full h-full outline-none touch-none"
            />

            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50">
                    <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mb-4">
                        <div
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-blue-400 font-mono text-xs tracking-widest animate-pulse">
                        {t.viewer.simulationLoading} {progress}%
                    </p>
                </div>
            )}

            {/* Start Overlay */}
            {!isLocked && !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-40">
                    <div className="bg-slate-950 border border-white/10 p-10 rounded-[32px] text-center max-w-lg shadow-2xl">
                        <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
                            <Move className="text-blue-500" size={32} />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Babylon Engine</h2>
                        <p className="text-neutral-500 text-sm mb-8 uppercase tracking-widest font-bold">Industrial Walkthrough v2</p>

                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-left">
                                <p className="text-[10px] text-neutral-500 font-bold mb-2 uppercase tracking-tight">{t.viewer.controls.move}</p>
                                <div className="flex gap-1">
                                    {['W', 'A', 'S', 'D'].map(k => (
                                        <span key={k} className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center text-xs font-bold">{k}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-left">
                                <p className="text-[10px] text-neutral-500 font-bold mb-2 uppercase tracking-tight">{t.viewer.navigate}</p>
                                <div className="flex items-center gap-2">
                                    <span className="bg-white/10 px-3 py-1 rounded-lg text-xs font-bold uppercase">{lang === 'en' ? 'Mouse' : 'Maus'}</span>
                                    <span className="text-[10px] text-neutral-600">Click to teleport</span>
                                </div>
                            </div>
                        </div>

                        <button
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl transition-all active:scale-[0.98] shadow-[0_0_30px_rgba(37,99,235,0.3)] uppercase tracking-widest"
                            onClick={() => canvasRef.current?.requestPointerLock()}
                        >
                            {t.viewer.simulationStart}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
