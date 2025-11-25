'use client';

import React, { useState } from "react";
import { useFormContext, Controller } from "react-hook-form"

import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ImageCropDialog } from "@/components/common/image-crop-dialog";

import { cn } from "@/lib/client/utils";

interface AvatarUploaderProps {
    name: string;
    className?: string;
    circularCrop?: boolean;
}

export const AvatarCropUploader: React.FC<AvatarUploaderProps> = ({
    name,
    className,
    circularCrop = true,
}) => {
    const { control, setValue } = useFormContext()

    const [open, setOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImageSrc(reader.result as string);
                setOpen(true);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <>
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem className="flex flex-col items-center">
                        <FormControl>
                            <label htmlFor="avatar-upload" className="cursor-pointer">
                                <Avatar className={cn(className)}>
                                    <AvatarImage src={field.value} />
                                    <AvatarFallback>
                                        <AvatarImage src="/unAuth.png" />
                                    </AvatarFallback>
                                </Avatar>
                            </label>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={onSelectFile}
                className="hidden"
            />

            <ImageCropDialog
                open={open}
                imageSrc={imageSrc || ""}
                circularCrop={circularCrop}
                onClose={() => setOpen(false)}
                onCropDone={(url) => {
                    setValue(name, url);
                    setOpen(false);
                }}
            />
        </>
    );
};