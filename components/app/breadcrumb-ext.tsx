"use client";

import React from "react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { breadcrumbStateStore } from "@/hooks/use-global-store";

import { useTranslations } from 'next-intl';

export function BreadcrumbExt() {
    const t = useTranslations();

    const treadcrumb = breadcrumbStateStore((state) => state.path);
    let len = treadcrumb.length;

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {
                    treadcrumb.map((item, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                            {index < len - 1 ?
                                (
                                    <BreadcrumbItem key={index} className="hidden md:block">
                                        <BreadcrumbLink href="#">{t(item)}</BreadcrumbLink>
                                    </BreadcrumbItem>
                                ) :
                                (
                                    <BreadcrumbItem key={index}>
                                        <BreadcrumbPage>{t(item)}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                )
                            }
                        </React.Fragment>
                    ))
                }
            </BreadcrumbList>
        </Breadcrumb>
    )
}