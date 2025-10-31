import { writeFile, mkdir } from "fs/promises";
import path from "path";
import fs from 'fs';
import { prisma } from "../../lib/PrismaClient";
import { getConfig, configCache } from "../../lib/server/global-cache";
import { Prisma } from "@prisma/client";

export async function upload(formData: FormData) {
    const file = formData.get("file") as File;
    if (!file) {
        return { result: 1, message: "fail" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}.${file.name.split('.').pop()?.toLowerCase()}`;
    const dir = path.join(process.cwd(), "public", "uploads", formData.get("catalog") as string, formData.get("adminId") as string);
    await mkdir(dir, { recursive: true });
    const filePath = path.join(dir, fileName);
    await writeFile(filePath, buffer);

    const url = `/uploads/${formData.get("catalog") as string}/${formData.get("adminId") as string}/${fileName}`;
    return { result: 0, message: "successful", data: { url: url } };
}

export async function getNotices(input: { [key: string]: any; }) {
    const where: Prisma.NoticesWhereInput = {
        sendTo: { in: [0, input.adminId] },
    };
    const total = await prisma.notices.count({
        where
    });

    if ((input.data.pageIndex - 1) * input.data.pageSize - total > 0) {
        input.data.pageIndex = Math.floor(total / input.data.pageSize) + 1
    }

    const list = await prisma.notices.findMany({
        select: {
            id: true,
            avatar: true,
            title: true,
            content: true,
            status: true,
            createAt: true,
        },
        where,
        skip: (input.data.pageIndex - 1) * input.data.pageSize,
        take: input.data.pageSize,
        orderBy: { id: 'desc' }
    })

    return { result: 0, message: "successful", data: { total: total, pageIndex: input.data.pageIndex, list: list } };
}

export async function getNewNotices(input: { [key: string]: any; }) {
    const where: Prisma.NoticesWhereInput = {
        sendTo: { in: [0, input.adminId] },
    };

    const list = await prisma.notices.findMany({
        select: {
            id: true,
            avatar: true,
            title: true,
            content: true
        },
        where,
        take: 3,
        orderBy: { id: 'desc' }
    })

    return { result: 0, message: "successful", data: { list: list } };
}

export async function getSysInfo(input: { [key: string]: any; }) {
    return {
        result: 0,
        message: "successful",
        data: {
            name: await getConfig("sysName"),
            logo: await getConfig("sysLogo"),
            version: await getConfig("sysVersion"),
        }
    };
}

export async function getAllConfig(input: { [key: string]: any; }) {
    return {
        result: 0,
        message: "successful",
        data: {
            ipWhitelist: await getConfig("ipWhitelist"),
            tokenExpiration: await getConfig("tokenExpiration"),
            sysServerTimeZone: await getConfig("sysServerTimeZone"),
            imageLimit: await getConfig("imageLimit"),
            sysName: await getConfig("sysName"),
            sysLogo: await getConfig("sysLogo"),
            sysVersion: await getConfig("sysVersion"),
            sysLanguage: await getConfig("sysLanguage"),
            compressImage: await getConfig("compressImage"),
        }
    };
}

export async function getDefaultLanguage(input: { [key: string]: any; }) {
    return {
        result: 0,
        message: "successful",
        data: {
            sysLanguage: await getConfig("sysLanguage"),
        }
    };
}

export async function updateConfig(input: { [key: string]: any; }) {
    for (const key in input.data) {
        configCache.set(key, input.data[key]);
        await prisma.config.update({
            where: { name: key },
            data: { value: String(input.data[key]) }
        });
    }
    return { result: 0, message: "successful" };
}

export function saveBase64Image(base64: string, filePath: string) {
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, buffer);
}