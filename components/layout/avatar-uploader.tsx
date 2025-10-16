"use client";

import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { toast } from "sonner"
import { upload } from "@/lib/client/utils"

export default function AvatarUploader({
    value,
    onChange,
}: {
    value?: string;
    onChange?: (url: string) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);

    const handleClick = () => inputRef.current?.click();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);

        try {
            const res = await upload("upload", file);

            if (res.data.url) {
                onChange?.(res.data.url);
                return;
            }
        } catch (err) {
            console.error("上传失败", err);
        } finally {
            setLoading(false);
        }
        toast.error('Fail');
    };

    return (
        <div className="relative inline-block">
            <Avatar
                className="w-12 h-12 cursor-pointer border-2 hover:opacity-80 transition"
                onClick={handleClick}
            >
                <AvatarImage src={value} alt="avatar" />
                <AvatarFallback>
                    <AvatarImage src="/unAuth.png" />
                </AvatarFallback>
            </Avatar>

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-full">
                    <Loader2 className="animate-spin w-5 h-5 text-gray-600" />
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
}