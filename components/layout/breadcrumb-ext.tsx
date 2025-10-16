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

export function BreadcrumbExt() {
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
                                        <BreadcrumbLink href="#">{item}</BreadcrumbLink>
                                    </BreadcrumbItem>
                                ) :
                                (
                                    <BreadcrumbItem key={index}>
                                        <BreadcrumbPage>{item}</BreadcrumbPage>
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