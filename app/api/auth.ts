import { NextResponse } from "next/server";
import { prisma } from "../../lib/PrismaClient";
import { saveBase64Image } from "./common";
import bcrypt from "bcrypt";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { generateToken } from "@/lib/server/jwt";
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

import { getConfig, adminCache } from "../../lib/server/global-cache";
import { RequestModel, ProfileModel } from "@/lib/models";

export async function login(input: RequestModel<{ name: string, password: string }>) {
    const admin = await prisma.admin.findFirst({
        where: {
            name: input.data.name,
        },
    })

    if (!admin) {
        return { result: 1, message: "error-username-password" };
    }
    //const hashedPassword = await bcrypt.hash('123456', 10);
    //console.log(hashedPassword)
    const isMatch = await bcrypt.compare(input.data.password, admin.password);

    let res;
    if (isMatch) {
        const expires = await getConfig("tokenExpiration");
        const tokenData = generateToken(admin.id, parseInt(expires));

        await prisma.admin.update({
            where: { id: admin.id },
            data: { jti: tokenData.jti, tokenHash: tokenData.tokenHash },
        });
        if (admin.name == 'admin') {
            adminCache.set(admin.id, {
                jti: tokenData.jti,
                tokenHash: tokenData.tokenHash,
                permissions: ['admin']
            })
            res = NextResponse.json({ result: 0, message: "successful", data: { name: admin.name, avatar: admin.avatar, permissions: ['admin'] } });
        } else {
            const result = await prisma.$queryRaw<{ permission: string }[]>`SELECT distinct b.permission FROM AdminRole a, RolePermission b WHERE a.adminId = ${admin.id} and a.roleId = b.roleId`;
            const permissions: string[] = [];
            result.forEach((v) => {
                permissions.push(v.permission);
            });

            adminCache.set(admin.id, {
                jti: tokenData.jti,
                tokenHash: tokenData.tokenHash,
                permissions: permissions
            })
            res = NextResponse.json({ result: 0, message: "successful", data: { name: admin.name, avatar: admin.avatar, permissions: permissions } });
        }
        res.cookies.set("token", tokenData.token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
        });
    } else {
        res = { result: 1, message: "error-username-password" };
    }
    return res;
}

export async function logout(input: RequestModel) {
    await prisma.admin.update({
        where: { id: input.adminId },
        data: { jti: "", tokenHash: "" },
    });
    return NextResponse.json(
        { result: 0, message: "successful" },
        {
            status: 200,
            headers: {
                "Set-Cookie": "token=; Path=/; HttpOnly; Max-Age=0"
            },
        }
    );
}

export async function checkToken(input: RequestModel) {
    return { result: 0, message: "successful" }
}

export async function updatePassword(input: RequestModel<{ password: string, password1: string }>) {
    const admin = await prisma.admin.findFirst({
        where: {
            id: input.adminId,
        },
    })

    if (!admin) {
        return { result: 1, message: "fail" };
    }

    const isMatch = await bcrypt.compare(input.data.password, admin.password);
    if (!isMatch) {
        return { result: 1, message: "incorrect-password" };
    }

    const password = await bcrypt.hash(input.data.password1, 10);
    await prisma.admin.update({
        where: { id: admin.id },
        data: { password: password },
    });

    return { result: 0, message: "successful" };
}

export async function getAdmin(input: RequestModel<{ name: string }>) {
    const admin = await prisma.admin.findFirst({
        where: {
            name: input.data.name,
        },
    })

    if (!admin) {
        return { result: 1, message: "user-not-exist" };
    }

    return {
        result: 0,
        message: "successful",
        data: {
            name: admin.name,
            avatar: admin.avatar,
            email: admin.email,
            tele: admin.tele,
            address: admin.address
        }
    }
}

export async function updateAdminBySelf(input: RequestModel<ProfileModel>) {
    let avatar = '';
    if (input.data.avatar.startsWith('data:image/png;base64')) {
        const fileName = `${Date.now()}.png`;
        const dir = path.join(process.cwd(), "public", "uploads", "admin");
        await mkdir(dir, { recursive: true });
        const filePath = path.join(dir, fileName);
        saveBase64Image(input.data.avatar, filePath);
        avatar = `/uploads/admin/${fileName}`;
    } else {
        avatar = input.data.avatar
    }
    await prisma.admin.update({
        where: { id: input.adminId },
        data: {
            avatar: avatar,
            email: input.data.email,
            tele: input.data.tele,
            address: input.data.address,
        },
    });
    return { result: 0, message: "successful", data: { avatar: avatar } };
}

export async function getGoogleAuthQr(input: RequestModel) {
    const admin = await prisma.admin.findFirst({
        where: {
            id: input.adminId,
        },
    })

    if (!admin) {
        return { result: 1, message: "user-not-exist" };
    }

    if (admin.isBindGoogle === 1) {
        return { result: 0, message: "successful", data: { binded: 1, url: '' } };
    }

    let secret = '';
    if (admin.googleSecret) {
        secret = admin.googleSecret
    } else {
        secret = authenticator.generateSecret();

        await prisma.admin.update({
            where: { id: input.adminId },
            data: {
                googleSecret: secret
            },
        });
    }

    const otpauth = authenticator.keyuri(String(input.adminId), '/leonz8080/nextjs-admin', secret);
    const qrCodeDataURL = await QRCode.toDataURL(otpauth);

    return { result: 0, message: "successful", data: { binded: 0, url: qrCodeDataURL } };
}

export async function resetGoogleAuthQr(input: RequestModel) {
    const secret = authenticator.generateSecret();

    const otpauth = authenticator.keyuri(String(input.adminId), '/leonz8080/nextjs-admin', secret);
    const qrCodeDataURL = await QRCode.toDataURL(otpauth);

    await prisma.admin.update({
        where: { id: input.adminId },
        data: {
            isBindGoogle: 0,
            googleSecret: secret
        },
    });

    return { result: 0, message: "successful", data: { binded: 0, url: qrCodeDataURL } };
}

export async function verifyGoogleAuth(input: RequestModel<{ code: string }>) {
    const admin = await prisma.admin.findFirst({
        where: {
            id: input.adminId,
        },
    })

    if (!admin) {
        return { result: 1, message: "user-not-exist" };
    }

    if (!admin.googleSecret) {
        return { result: 1, message: "google-no-bound" };
    }

    const isValid = authenticator.check(input.data.code, admin.googleSecret);

    if (isValid) {
        return { result: 0, message: "successful" };
    }
    return { result: 1, message: "fail" };
}

export async function cancelGoogleAuth(input: RequestModel) {
    await prisma.admin.update({
        where: { id: input.adminId },
        data: {
            isBindGoogle: 0,
            googleSecret: ''
        },
    });

    return { result: 0, message: "successful" };
}