"use client"

import "./globals.css";

import { useEffect, useMemo } from 'react'

import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { Toaster } from "sonner"

import { useLanguageStore } from "@/hooks/use-global-store";

import { languages } from '@/constants/language';
import { request } from "@/lib/client/utils";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setLanguage, language } = useLanguageStore();

  function getDefaultLanguage() {
    request('getDefaultLanguage', {}).then((res) => {
      if (res.result === 0 && res.data) {
        var lang = res.data.sysLanguage;
        if (lang === 'browser') {
          if (typeof navigator !== 'undefined') {
            lang = navigator.language.toLowerCase();
            if (lang.indexOf('-') > 0) {
              lang = lang.substring(0, lang.indexOf('-'));
            }
          }
          if (lang in languages) {
            setLanguage(lang);
          } else {
            setLanguage('en');
          }
        } else {
          if (lang in languages) {
            setLanguage(lang);
          } else {
            setLanguage('en');
          }
        }
      } else {
        setLanguage('en');
      }
    })
  }

  useEffect(() => {
    getDefaultLanguage();
  }, []);

  return (
    <html lang="en">
      <body>
        <NextIntlClientProvider locale={language} messages={languages[language]}>
          <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Toaster />
            {children}
          </NextThemesProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
