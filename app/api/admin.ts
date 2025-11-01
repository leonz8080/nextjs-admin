import { prisma } from "../../lib/PrismaClient";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

import { adminCache } from "@/lib/server/global-cache"

import { RequestModel, AdminModel } from "@/lib/models";

export async function get(input: RequestModel<{ pageIndex: number, pageSize: number, name: string }>) {
    const data = input.data;

    const where: Prisma.AdminWhereInput = {
        ...(data.name ? { name: { contains: data.name } } : {}),
    };
    const total = await prisma.admin.count({
        where
    });

    if ((data.pageIndex - 1) * data.pageSize - total > 0) {
        data.pageIndex = Math.floor(total / data.pageSize) + 1
    }

    const list = await prisma.admin.findMany({
        select: {
            id: true,
            name: true,
            avatar: true,
            tele: true,
            email: true,
            address: true,
        },
        where,
        skip: (data.pageIndex - 1) * data.pageSize,
        take: data.pageSize,
        orderBy: { id: 'desc' }
    })

    return { result: 0, message: "successful", data: { total: total, pageIndex: data.pageIndex, list: list } };
}

export async function insert(input: RequestModel<AdminModel>) {

    const count = await prisma.admin.count({
        where: {
            name: input.data.name,
        },
    })
    if (count > 0) {
        return { result: 1, message: "name-exists" };
    }

    const password = await bcrypt.hash(input.data.password, 10);
    try {
        await prisma.$transaction(async (tx) => {
            const ra = await tx.admin.create({
                data: {
                    name: input.data.name,
                    avatar: input.data.avatar,
                    email: input.data.email,
                    tele: input.data.tele,
                    address: input.data.address,
                    password: password
                },
            });

            const adminRole: { adminId: number, roleId: number }[] = [];
            input.data.roles.forEach((v: number) => {
                adminRole.push({
                    adminId: ra.id,
                    roleId: v
                });
            })
            await tx.adminRole.createMany({
                data: adminRole,
            });
        });
        return { result: 0, message: "successful" };
    } catch (err) {
        return { result: 1, message: "fail" };
    }
}

export async function update(input: RequestModel<AdminModel>) {
    if (input.data.id == 1) {
        return { result: 1, message: "fail" };
    }

    const admin = await prisma.admin.findFirst({
        where: {
            name: input.data.name,
        },
    })
    if (admin && admin.id !== input.data.id) {
        return { result: 1, message: "name-exists" };
    }

    const adminRole: { adminId: number, roleId: number }[] = [];
    input.data.roles.forEach((v: number) => {
        adminRole.push({
            adminId: input.data.id,
            roleId: v
        });
    })
    try {
        await prisma.$transaction(async (tx) => {
            await tx.adminRole.deleteMany({
                where: {
                    adminId: input.data.id,
                },
            })

            await tx.adminRole.createMany({
                data: adminRole,
            });

            if (input.data.password !== '') {
                const password = await bcrypt.hash(input.data.password, 10);
                await tx.admin.update({
                    where: { id: input.data.id },
                    data: {
                        name: input.data.name,
                        avatar: input.data.avatar,
                        email: input.data.email,
                        tele: input.data.tele,
                        address: input.data.address,
                        password: password
                    },
                });
            } else {
                await tx.admin.update({
                    where: { id: input.data.id },
                    data: {
                        name: input.data.name,
                        avatar: input.data.avatar,
                        email: input.data.email,
                        tele: input.data.tele,
                        address: input.data.address,
                    },
                });
            }
        });
    } catch (err) {
        return { result: 1, message: "fail" };
    }

    if (adminCache.has(input.data.id)) {
        adminCache.del(input.data.id)
    }
    return { result: 0, message: "successful" };
}

export async function del(input: RequestModel<{ id: number }>) {
    if (input.data.id == 1) {
        return { result: 1, message: "fail" };
    }
    try {
        await prisma.$transaction(async (tx) => {
            await tx.adminRole.deleteMany({
                where: {
                    adminId: input.data.id,
                },
            })

            await tx.admin.delete({
                where: {
                    id: input.data.id,
                },
            })
        });

        adminCache.del(input.data.id)
        return { result: 0, message: "successful" };
    } catch (err) {
        return { result: 1, message: "fail" };
    }
}

export async function getAdminRole(input: RequestModel<{ id: number }>) {
    const list = await prisma.adminRole.findMany({
        where: {
            adminId: input.data.id
        }
    })
    const roles: number[] = []
    list.forEach((v) => {
        roles.push(v.roleId)
    })
    return { result: 0, message: "successful", data: { roles: roles } };
}