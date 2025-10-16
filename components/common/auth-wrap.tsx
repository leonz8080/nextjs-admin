"use client"

import { userPermissionsStore } from "@/hooks/use-global-store";

export function Auth({
    permission,
    children,
}: {
    permission?: string | string[];
    children: React.ReactNode;
}) {
    const { permissions } = userPermissionsStore();

    if (!permission) return <>{children}</>;

    const allowed = Array.isArray(permission)
        ? permission.some((p) => permissions.includes(p))
        : permissions.includes(permission);

    return allowed ? <>{children}</> : null;
}

/*<Auth permission={["admin", "manager"]}>
...
</Auth>*/