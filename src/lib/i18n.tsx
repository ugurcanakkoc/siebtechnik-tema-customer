"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import en from "@/locales/en.json";
import de from "@/locales/de.json";

import customerData from "@/data/customer.json";

type Language = "en" | "de";
const locales = { en, de } as const;

type TranslationType = typeof en;

interface I18nContextType {
    t: TranslationType;
    lang: Language;
    setLang: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Language>(customerData.defaultLang as Language || "de");

    const value = {
        t: locales[lang] as unknown as TranslationType,
        lang,
        setLang
    };

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error("useTranslation must be used within an I18nProvider");
    }
    return context;
}
