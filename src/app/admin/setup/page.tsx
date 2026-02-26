"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Check, Loader2, Rocket, Globe, FileImage } from "lucide-react";
import Link from "next/link";

export default function SetupPage() {
    const [customerName, setCustomerName] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [defaultLang, setDefaultLang] = useState("de");
    const [logo, setLogo] = useState<File | null>(null);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [generatedPath, setGeneratedPath] = useState("");

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customerName || !websiteUrl || !logo) return;

        setStatus("loading");
        setMessage("Projeniz hazırlanıyor...");

        const formData = new FormData();
        formData.append("customerName", customerName);
        formData.append("websiteUrl", websiteUrl);
        formData.append("defaultLang", defaultLang);
        formData.append("logo", logo);

        try {
            const res = await fetch("/api/setup", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                setStatus("success");
                setMessage(data.message);
                setGeneratedPath(data.path);
            } else {
                setStatus("error");
                setMessage(data.error || "Bir hata oluştu.");
            }
        } catch (error) {
            setStatus("error");
            setMessage("İşlem sırasında bir hata oluştu.");
        }
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 selection:bg-blue-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl relative z-10"
            >
                <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                            <Rocket className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent italic">
                                UVP PROJECT GEN
                            </h1>
                            <p className="text-white/40 text-sm font-medium tracking-wide">
                                OTOMATİK MARKA VE PROJE OLUŞTURUCU
                            </p>
                        </div>
                    </div>

                    {status === "success" ? (
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center py-12"
                        >
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30 mx-auto mb-6">
                                <Check className="w-10 h-10 text-green-400" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Proje Başarıyla Oluşturuldu!</h2>
                            <p className="text-white/60 mb-8 max-w-md mx-auto">
                                Yeni projeniz şu adreste hazır bekliyor: <br />
                                <code className="block mt-4 p-3 bg-white/5 rounded-lg text-blue-300 break-all select-all">
                                    {generatedPath}
                                </code>
                            </p>
                            <button
                                onClick={() => setStatus("idle")}
                                className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-sm font-bold tracking-widest uppercase"
                            >
                                Yeni Oluştur
                            </button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleGenerate} className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Customer Name */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase ml-1">
                                        Müşteri Adı
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <Rocket className="w-4 h-4 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                                        </div>
                                        <input
                                            required
                                            type="text"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            placeholder="Örn: Siemens"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-white/10"
                                        />
                                    </div>
                                </div>

                                {/* Website URL */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase ml-1">
                                        Web Sitesi URL
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <Globe className="w-4 h-4 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                                        </div>
                                        <input
                                            required
                                            type="url"
                                            value={websiteUrl}
                                            onChange={(e) => setWebsiteUrl(e.target.value)}
                                            placeholder="https://www.customer.com"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-white/10"
                                        />
                                    </div>
                                </div>

                                {/* Default Language */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase ml-1">
                                        Varsayılan Dil
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <Globe className="w-4 h-4 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                                        </div>
                                        <select
                                            value={defaultLang}
                                            onChange={(e) => setDefaultLang(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="de" className="bg-[#0a0a0a]">Deutsch (DE)</option>
                                            <option value="en" className="bg-[#0a0a0a]">English (EN)</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-white/20">
                                            <Upload className="w-3 h-3 rotate-180" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Logo Upload */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase ml-1">
                                    Müşteri Logosu (PNG/SVG)
                                </label>
                                <div className="relative group transition-all">
                                    <input
                                        required
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setLogo(e.target.files?.[0] || null)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                    />
                                    <div className={`w-full border-2 border-dashed ${logo ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/10 bg-white/5'} rounded-xl p-8 flex flex-col items-center justify-center transition-all group-hover:border-blue-500/30`}>
                                        <div className={`w-12 h-12 ${logo ? 'bg-blue-500/20' : 'bg-white/5'} rounded-full flex items-center justify-center mb-4 transition-all group-hover:scale-110`}>
                                            <FileImage className={`w-6 h-6 ${logo ? 'text-blue-400' : 'text-white/20'}`} />
                                        </div>
                                        <p className="text-sm font-bold text-white/60 mb-1">
                                            {logo ? logo.name : "Logoyu Buraya Sürükleyin veya Seçin"}
                                        </p>
                                        <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest">
                                            MAX 5MB • PNG, SVG, JPG
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                disabled={status === "loading" || !customerName || !websiteUrl || !logo}
                                className="w-full bg-white text-black py-5 rounded-xl font-black tracking-[0.2em] text-xs uppercase hover:bg-blue-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_20px_40px_-15px_rgba(255,255,255,0.15)] flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                {status === "loading" ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Hazırlanıyor...
                                    </>
                                ) : (
                                    "PROJEYİ OLUŞTUR"
                                )}
                            </button>

                            {status === "error" && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center text-red-400 text-xs font-bold bg-red-500/10 py-3 rounded-lg border border-red-500/20"
                                >
                                    {message}
                                </motion.p>
                            )}
                        </form>
                    )}
                </div>

                <div className="mt-8 flex justify-center gap-8">
                    <Link href="/" className="text-[10px] font-black tracking-widest text-white/20 hover:text-white transition-colors uppercase">
                        ANA SAYFAYA DÖN
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}
