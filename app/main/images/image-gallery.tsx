"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

import Image from "next/image";
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import ImagePreviewDialog from '@/components/layout/image-perview-dialog';

export function ImageGallery({ images }: { images: string[] }) {
    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Image Gallery</CardDescription>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {images.map((img, index) => (
                            <div
                                key={index}
                                className="relative w-full aspect-square rounded-lg overflow-hidden cursor-pointer border hover:opacity-80 transition"
                                onClick={() => {
                                    setCurrentIndex(index);
                                    setOpen(true);
                                }}
                            >
                                <Image src={img} alt={`image-${index}`} fill sizes="200px" className="object-cover" />
                            </div>
                        ))}
                    </div>
                </CardFooter>
            </Card>

            {/* 弹窗组件 */}
            <ImagePreviewDialog
                images={images}
                currentIndex={currentIndex}
                open={open}
                onClose={() => setOpen(false)}
                onChangeIndex={setCurrentIndex}
            />
        </>
    )
}