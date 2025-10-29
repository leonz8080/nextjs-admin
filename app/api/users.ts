import { NextResponse } from "next/server";
import { prisma } from "../../lib/PrismaClient";
import { Prisma } from "@prisma/client";
import ExcelJS from 'exceljs'
import * as fs from "fs";
import path from "path";

export async function get(input: { [key: string]: any; }) {
    const where: Prisma.UsersWhereInput = {
        ...(input.data.level ? { level: input.data.level } : {}),
        ...(input.data.name ? { name: { contains: input.data.name } } : {}),
    };
    const total = await prisma.users.count({
        where
    });

    if ((input.data.pageIndex - 1) * input.data.pageSize - total > 0) {
        input.data.pageIndex = Math.floor(total / input.data.pageSize) + 1
    }

    const list = await prisma.users.findMany({
        where,
        skip: (input.data.pageIndex - 1) * input.data.pageSize,
        take: input.data.pageSize,
        orderBy: { id: 'desc' }
    })

    return { result: 0, message: "successful", data: { total: total, pageIndex: input.data.pageIndex, list: list } };
}

export async function insert(input: { [key: string]: any; }) {
    const count = await prisma.users.count({
        where: {
            name: input.data.name,
        },
    })
    if (count > 0) {
        return { result: 1, message: "name-exists" };
    }

    const res = await prisma.users.create({
        data: input.data,
    });
    if (res) {
        return { result: 0, message: "successful" };
    }
    return { result: 1, message: "Fail!" };
}

export async function update(input: { [key: string]: any; }) {
    if(input.data.column === "name") {
        const count = await prisma.users.count({
            where: {
                name: input.data.value,
                NOT: { id: input.data.id },
            },
        })
        if (count > 0) {
            return { result: 1, message: "name-exists" };
        }
    }
    
    const res = await prisma.users.update({
        where: { id: input.data.id },
        data: {
            [input.data.column]: input.data.value
        },
    });
    if (!res) {
        return { result: 0, message: "fail" };
    }
    return { result: 0, message: "successful" };
}

export async function del(input: { [key: string]: any; }) {
    const res = await prisma.users.deleteMany({
        where: {
            id: { in: input.data.id },
        },
    })
    if (!res) {
        return { result: 0, message: "fail" };
    }
    return { result: 0, message: "successful" };
}

export async function exp(input: { [key: string]: any; }) {
    const where: Prisma.UsersWhereInput = {
        ...(input.data.level ? { level: input.data.level } : {}),
        ...(input.data.name ? { name: { contains: input.data.name } } : {}),
    };

    const list = await prisma.users.findMany({
        where,
        orderBy: { id: 'desc' }
    })

    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Users')

    sheet.columns = [
        { header: 'Avatar', key: 'avatar' },
        { header: 'Name', key: 'name' },
        { header: 'Level', key: 'level' },
        { header: 'Expiration', key: 'expiration' },
        { header: 'IsValid', key: 'isValid' },
        { header: 'Remark', key: 'remark' },
        { header: 'Status', key: 'status' },
    ]

    list.forEach((v, i) => {
        const row = sheet.addRow({
            name: v.name,
            level: v.level,
            expiration: v.expiration,
            isValid: v.isValid===0?'invalid':'valid',
            remark: v.remark,
            status: v.status,
        });
        const rowIndex = row.number;

        const imagePath = path.join(process.cwd(), "public", v.avatar);
        if (fs.existsSync(imagePath)) {
            var ext = path.extname(imagePath).slice(1)
            if (ext === "jpg") ext = "jpeg"; 
            if (ext === 'png' || ext === 'jpeg' || ext === 'gif') {
                const imageId = workbook.addImage({
                    filename: imagePath,
                    extension: ext,
                });

                sheet.addImage(imageId, {
                    tl: { col: 0, row: rowIndex - 1 }, 
                    ext: { width: 50, height: 50 },
                });

                sheet.getRow(rowIndex).height = 80;
            }
        }
    })

    const buffer = await workbook.xlsx.writeBuffer()

    return new NextResponse(buffer, {
        headers: {
            'Content-Type':
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="users.xlsx"',
        },
    })
}