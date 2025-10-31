"use client";

import { useEffect, useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { off } from "process";

interface ImagePreviewDialogProps {
    images: StaticImageData[];
    currentIndex: number;
    open: boolean;
    onClose: () => void;
    onChangeIndex?: (index: number) => void; // 可选回调
}

export default function ImagePreviewDialog({
    images,
    currentIndex,
    open,
    onClose,
    onChangeIndex,
}: ImagePreviewDialogProps) {
    const handlePrev = () => {
        const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        onChangeIndex?.(newIndex);
    };

    const handleNext = () => {
        const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        onChangeIndex?.(newIndex);
    };

    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") handlePrev();
            if (e.key === "ArrowRight") handleNext();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, currentIndex]);

    if (images.length === 0) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-none flex items-center justify-center [&_[data-slot=dialog-close]]:hidden">
                <DialogTitle className="sr-only">Image Preview</DialogTitle>
                <div className="flex items-center">
                    <button
                        onClick={handlePrev}
                        className="-translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="relative w-[90vw] h-[80vh] flex items-center justify-center">

                        <button
                            onClick={onClose}
                            style={{
                                position: "absolute",
                                top: -32,
                                right: -40
                            }}
                            className="bg-black/40 text-white p-2 rounded-full z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <Image
                            src={images[currentIndex]}
                            alt={`preview-${currentIndex}`}
                            fill
                            className="object-contain select-none"
                            sizes="(max-width: 1200px) 90vw, 1600px"
                        />
                    </div>

                    <button
                        onClick={handleNext}
                        className="-translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
