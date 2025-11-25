import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useTranslations } from 'next-intl';

interface DeleteConfirmProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function DeleteConfirmDialog({ open, onConfirm, onClose }: DeleteConfirmProps) {
    const t = useTranslations();

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>{t("confirm-del")}</DialogTitle>
                    <DialogDescription>
                        {t("confirm-del-tip")}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            onClose();
                        }}>{t("cancel")}</Button>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            onConfirm();
                        }}
                    >
                        {t("confirm-del")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}