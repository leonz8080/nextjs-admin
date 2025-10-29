"use client";

import { useTabsStore } from "@/hooks/use-global-store";

import { useTranslations } from 'next-intl';

export default function P403() {
    const t = useTranslations();

    const { tabs, removeTab } = useTabsStore();

    function close(): void {
        if (tabs.length > 0) {
            removeTab('/error-page/p403')
        }
    }

    return (
        <section className="flex items-center h-full p-16 dark:bg-gray-50 dark:text-gray-800">
            <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
                <div className="max-w-md text-center">
                    <h2 className="mb-8 font-extrabold text-9xl dark:text-gray-400">
                        <span className="sr-only">{t("error")}</span>403
                    </h2>
                    <p className="text-2xl font-semibold md:text-3xl">
                        {t("403-title")}
                    </p>
                    <p className="mt-4 mb-8 dark:text-gray-600">
                        {t("403-subtitle")}
                    </p>
                    <a rel="noopener noreferrer" href="#" className="px-8 py-3 font-semibold rounded dark:bg-violet-600 dark:text-gray-50" onClick={close}>
                        {t("close-tab")}
                    </a>
                </div>
            </div>
        </section>
    )

}