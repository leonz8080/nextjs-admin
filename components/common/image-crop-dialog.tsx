'use client'

import React, { useEffect, useRef, useState } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { useTranslations } from 'next-intl';

interface CropDialogProps {
    open: boolean;
    imageSrc: string;
    circularCrop: boolean;
    onClose: () => void;
    onCropDone: (base64: string) => void;
}

export function ImageCropDialog({ open, imageSrc, circularCrop, onClose, onCropDone }: CropDialogProps) {
    const t = useTranslations();

    const [crop, setCrop] = useState<Crop>({ unit: "%", x: 25, y: 25, width: 50, height: 50 });
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
    const [croppedUrl, setCroppedUrl] = useState<string | null>(null);

    const imgRef = useRef<HTMLImageElement | null>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

    const onImageLoad = (img: HTMLImageElement) => {
        imgRef.current = img;
    };

    useEffect(() => {
        if (!completedCrop || !imgRef.current || !previewCanvasRef.current) return;

        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        const crop = completedCrop;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const pixelRatio = window.devicePixelRatio;
        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = "high";

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (circularCrop) {
            ctx.beginPath();
            ctx.arc(crop.width / 2, crop.height / 2, crop.width / 2, 0, 2 * Math.PI);
            ctx.clip();
        }

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        setCroppedUrl(canvas.toDataURL("image/png"));
    }, [completedCrop]);

    const handleDone = () => {
        if (croppedUrl) onCropDone(croppedUrl);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                {imageSrc && (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="max-w-[200px] max-h-[200px] overflow-hidden">
                            <ReactCrop
                                crop={crop}
                                onChange={(c) => setCrop(c)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={1}
                                circularCrop={circularCrop}
                            >
                                <img
                                    src={imageSrc}
                                    onLoad={(e) => onImageLoad(e.currentTarget)}
                                    alt="source"
                                    className="w-full h-full object-contain"
                                />
                            </ReactCrop>
                        </div>

                        <div className="text-center">
                            <p className="text-sm mb-1">{t("preview")}</p>
                            <canvas key={circularCrop ? "circle" : "square"} ref={previewCanvasRef} className={cn("border w-32 h-32 object-cover", circularCrop ? "rounded-full" : "rounded-none")} />
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" onClick={onClose}>{t("cancel")}</Button>
                            <Button onClick={handleDone}>{t("confirm")}</Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}