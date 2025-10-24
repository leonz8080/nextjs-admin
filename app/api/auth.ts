import { NextResponse } from "next/server";
import { prisma } from "../../lib/PrismaClient";
import { saveBase64Image } from "./common";
import bcrypt from "bcrypt";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { generateToken } from "@/lib/server/jwt";

import { getConfig } from "../../lib/server/global-cache";

export async function login(input: { [key: string]: any; }) {
    const admin = await prisma.admin.findFirst({
        where: {
            name: input.data.name,
        },
    })

    if (!admin) {
        return { result: 1, message: "Invalid username or password." };
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
            res = NextResponse.json({ result: 0, message: "Login successful!", data: { name: admin.name, avatar: admin.avatar, permissions: ['admin'] } });
        } else {
            const result = await prisma.$queryRaw<{ permission: string }[]>`SELECT distinct b.permission FROM AdminRole a, RolePermission b WHERE a.adminId = ${admin.id} and a.roleId = b.roleId`;
            let permissions: string[] = [];
            result.forEach((v) => {
                permissions.push(v.permission);
            });
            res = NextResponse.json({ result: 0, message: "Login successful!", data: { name: admin.name, avatar: admin.avatar, permissions: permissions } });
        }
        res.cookies.set("token", tokenData.token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
        });
    } else {
        res = { result: 1, message: "Invalid username or password." };
    }
    return res;
}

export async function logout(input: { [key: string]: any; }) {
    await prisma.admin.update({
        where: { id: input.adminId },
        data: { jti: "", tokenHash: "" },
    });
    return NextResponse.json(
        { result: 0, message: "Logout successful!" },
        {
            status: 200,
            headers: {
                "Set-Cookie": "token=; Path=/; HttpOnly; Max-Age=0"
            },
        }
    );
}

export async function checkToken(input: { [key: string]: any; }) {
    return { result: 0, message: "successful!" }
}

export async function updatePassword(input: { [key: string]: any; }) {
    const admin = await prisma.admin.findFirst({
        where: {
            id: input.adminId,
        },
    })

    if (!admin) {
        return { result: 1, message: "Fail." };
    }

    const isMatch = await bcrypt.compare(input.data.password, admin.password);
    if (!isMatch) {
        return { result: 1, message: "Incorrect password" };
    }

    const password = await bcrypt.hash(input.data.password1, 10);
    await prisma.admin.update({
        where: { id: admin.id },
        data: { password: password },
    });

    return { result: 0, message: "Successful!" };
}

export async function getAdmin(input: { [key: string]: any; }) {
    const admin = await prisma.admin.findFirst({
        where: {
            name: input.data.name,
        },
    })

    if (!admin) {
        return { result: 1, message: "User does not exist." };
    }

    return {
        result: 0,
        message: "successful!",
        data: {
            name: admin.name,
            avatar: admin.avatar,
            email: admin.email,
            tele: admin.tele,
            address: admin.address
        }
    }
}

export async function updateAdminBySelf(input: { [key: string]: any; }) {
    var avatar = '';
    if (input.data.avatar.startsWith('data:image/png;base64')) {
        const fileName = `${input.admin.name}.png`;
        const dir = path.join(process.cwd(), "public", "uploads", input.admin.name);
        await mkdir(dir, { recursive: true });
        const filePath = path.join(dir, fileName);
        saveBase64Image(input.data.avatar, filePath);
        avatar = `/uploads/${input.admin.name}/${fileName}`;
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
    return { result: 0, message: "successful!", data: { avatar: avatar } };
}