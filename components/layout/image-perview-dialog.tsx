"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImagePreviewDialogProps {
    images: string[];
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

    // 键盘左右切换
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
            <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-5xl relative">
                {/* 关闭按钮 */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* 左右切换 */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={handlePrev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                {/* 图片 */}
                <div className="relative w-full max-h-[80vh] flex justify-center items-center">
                    <Image
                        src={images[currentIndex]}
                        alt={`preview-${currentIndex}`}
                        width={1600}
                        height={900}
                        className="object-contain max-h-[80vh] select-none"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
