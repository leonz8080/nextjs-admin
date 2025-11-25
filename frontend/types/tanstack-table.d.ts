import { ColumnMeta } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
    interface ColumnMeta<TData extends unknown, TValue> {
        /** 自定义 Tailwind 类名 */
        className?: string;
    }
}