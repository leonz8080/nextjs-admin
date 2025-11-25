"use client"

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"

import { AuthWrap } from "@/components/common/auth-wrap"
import { userPermissionsStore } from "@/hooks/use-global-store"

import { useTranslations } from 'next-intl';

export default function RoleSwitch() {
    const t = useTranslations();

    const { permissions, setUserPermissions } = userPermissionsStore();
    const [isSuperAdmin, setSuperAdmin] = useState(false);

    useEffect(() => {
        if (permissions.includes('admin')) {
            setSuperAdmin(true)
        } else {
            setSuperAdmin(false)
        }
    }, [permissions]);

    function switchToSuperAdmin() {
        if (isSuperAdmin) {
            return
        }
        setUserPermissions(['admin']);
    }

    function switchToAdmin() {
        if (!isSuperAdmin) {
            return
        }
        setUserPermissions([
            'userAnalysis',
            'salesAnalysis',
            'table',
            'adminRoleSwitching'
        ]);
    }

    return (
        <div className="mt-10">
            <div className="items-center gap-2 text-center">
                <h1 className="text-xl font-bold">
                    {t("switch-role-title")}
                </h1>
                <div className="mt-2 text-sm font-normal">
                    {t("current-role")} {isSuperAdmin ? "Super Administrator" : "Administrator"}
                </div>
            </div>
            <div className="items-center gap-2 text-center mt-6">
                <Button variant={isSuperAdmin ? "default" : "outline"} type="button" onClick={switchToSuperAdmin}>
                    {t("super-admin")}
                </Button>
                <Button variant={isSuperAdmin ? "outline" : "default"} type="button" onClick={switchToAdmin} className="ml-4">
                    {t("administrator")}
                </Button>
            </div>
            <AuthWrap permission={['admin']}>
                <div className="items-center text-center mt-6">
                    {t("super-admin-tip")}
                </div>
            </AuthWrap>
        </div>
    )
}