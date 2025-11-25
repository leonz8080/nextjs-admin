"use client";

export interface Timezone {
    value: string; // IANA 时区名
    label: string; // 显示名称，带 UTC 偏移
}

export const timezones: Timezone[] = [
    { value: "UTC", label: "(UTC+0) Coordinated Universal Time" },
    { value: "Europe/London", label: "(UTC+0) London" },
    { value: "Europe/Berlin", label: "(UTC+1) Berlin" },
    { value: "Europe/Paris", label: "(UTC+1) Paris" },
    { value: "Europe/Moscow", label: "(UTC+3) Moscow" },
    { value: "Asia/Dubai", label: "(UTC+4) Dubai" },
    { value: "Asia/Karachi", label: "(UTC+5) Karachi" },
    { value: "Asia/Kolkata", label: "(UTC+5:30) Kolkata" },
    { value: "Asia/Dhaka", label: "(UTC+6) Dhaka" },
    { value: "Asia/Bangkok", label: "(UTC+7) Bangkok" },
    { value: "Asia/Shanghai", label: "(UTC+8) Shanghai" },
    { value: "Asia/Tokyo", label: "(UTC+9) Tokyo" },
    { value: "Australia/Sydney", label: "(UTC+10) Sydney" },
    { value: "Pacific/Auckland", label: "(UTC+12) Auckland" },
    { value: "America/New_York", label: "(UTC-5) New York" },
    { value: "America/Chicago", label: "(UTC-6) Chicago" },
    { value: "America/Denver", label: "(UTC-7) Denver" },
    { value: "America/Los_Angeles", label: "(UTC-8) Los Angeles" },
    { value: "America/Sao_Paulo", label: "(UTC-3) São Paulo" },
    { value: "America/Mexico_City", label: "(UTC-6) Mexico City" },
    { value: "America/Toronto", label: "(UTC-5) Toronto" },
    { value: "America/Vancouver", label: "(UTC-8) Vancouver" },
    { value: "Africa/Johannesburg", label: "(UTC+2) Johannesburg" },
    { value: "Africa/Cairo", label: "(UTC+2) Cairo" },
    { value: "Europe/Istanbul", label: "(UTC+3) Istanbul" },
    { value: "Asia/Jakarta", label: "(UTC+7) Jakarta" },
    { value: "Asia/Singapore", label: "(UTC+8) Singapore" },
    { value: "Asia/Hong_Kong", label: "(UTC+8) Hong Kong" },
    { value: "Asia/Seoul", label: "(UTC+9) Seoul" },
    { value: "Asia/Taipei", label: "(UTC+8) Taipei" },
] as const