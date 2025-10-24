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

interface DeleteConfirmProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function DeleteConfirmDialog({ open, onConfirm, onClose }: DeleteConfirmProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>确认删除</DialogTitle>
                    <DialogDescription>
                        此操作无法撤销，确认删除吗？
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            onClose();
                        }}>取消</Button>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            onConfirm();
                        }}
                    >
                        确认删除
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}