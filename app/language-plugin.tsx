'use client'

import { useEffect } from 'react'
import { NextIntlClientProvider } from 'next-intl';
import { useLanguageStore } from "@/hooks/use-global-store"

import { languages } from '@/config/language';

export default function LanguagePlugin({ children }: { children: React.ReactNode }) {
    const { setLanguage } = useLanguageStore();

    var lang = navigator.language.toLowerCase();
    if (lang.indexOf('-') > 0) {
        lang = lang.substring(0, lang.indexOf('-'));
    }
    if (lang === 'zh' || lang === 'en') {
        setLanguage(lang);
    } else {
        setLanguage('en');
    }
    const language = useLanguageStore((state) => state.language);

    useEffect(() => {
        const lang = navigator.language.toLowerCase()
        console.log('检测到语言:', lang)
        // TODO: 根据语言切换 next-intl locale
    }, [])

    return (
        <NextIntlClientProvider locale={language} messages={languages[language]}>
            {children}
        </NextIntlClientProvider>
    )
}