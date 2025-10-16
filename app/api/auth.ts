import { NextResponse } from "next/server";
import { prisma } from "../../lib/PrismaClient";
import crypto from "crypto";
import bcrypt from "bcrypt";

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
        const token = crypto.randomBytes(32).toString("hex");
        await prisma.admin.update({
            where: { id: admin.id },
            data: { token: token },
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
        res.cookies.set("token", token, {
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
        where: { id: input.admin.id },
        data: { token: "" },
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
            id: input.admin.id,
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

    return { result: 0, message: "Successful!"};
}