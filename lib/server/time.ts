import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { configCache } from "./global-cache";

export const formatServerTime = (
    date: Date | string | number,
    tz: string = "UTC",
    fmt: string = "yyyy-MM-dd HH:mm:ss"
) => {
    return formatInTimeZone(new Date(date), tz, fmt);
};

export const formatDateTime = (date: Date | string | number, fmt?: string) => {
    const sysTimezone = configCache.get("sysTimezone") || "UTC";
    return formatServerTime(date, String(sysTimezone), fmt || "yyyy-MM-dd HH:mm:ss");
}