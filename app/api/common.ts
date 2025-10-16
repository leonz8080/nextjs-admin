import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "../../lib/PrismaClient";
import { Prisma } from "@prisma/client";

export async function upload(formData: FormData) {
    const file = formData.get("file") as File;
    if (!file) {
        return { result: 1, message: "fail!" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name}`;
    const dir = path.join(process.cwd(), "public", "uploads", formData.get("adminName") as string);
    await mkdir(dir, { recursive: true });
    const filePath = path.join(dir, fileName);
    await writeFile(filePath, buffer);

    const url = `/uploads/${formData.get("adminName") as string}/${fileName}`;
    return { result: 0, message: "successful!", data: { url: url } };
}

export async function getNotices(input: { [key: string]: any; }) {
    const where: Prisma.NoticesWhereInput = {
        sendTo: { in: [0, input.admin.id] },
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

    return { result: 0, message: "successful!", data: { total: total, pageIndex: input.data.pageIndex, list: list } };
}

export async function getNewNotices(input: { [key: string]: any; }) {
    const where: Prisma.NoticesWhereInput = {
        sendTo: { in: [0, input.admin.id] },
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

    return { result: 0, message: "successful!", data: { list: list } };
}