import { prisma } from "../../lib/PrismaClient";
import { Prisma } from "@prisma/client";

export async function get(input: { [key: string]: any; }) {
    const where: Prisma.RolesWhereInput = {
        ...(input.data.name ? { name: { contains: input.data.name } } : {}),
    };
    const total = await prisma.roles.count({
        where
    });

    if ((input.data.pageIndex - 1) * input.data.pageSize - total > 0) {
        input.data.pageIndex = Math.floor(total / input.data.pageSize) + 1
    }

    const list = await prisma.roles.findMany({
        where,
        skip: (input.data.pageIndex - 1) * input.data.pageSize,
        take: input.data.pageSize,
        orderBy: { id: 'desc' }
    })

    return { result: 0, message: "successful!", data: { total: total, pageIndex: input.data.pageIndex, list: list } };
}

export async function insert(input: { [key: string]: any; }) {
    const count = await prisma.roles.count({
        where: {
            name: input.data.name,
        },
    })
    if(count > 0) {
        return { result: 1, message: "Name already exists" };
    }

    try {
        await prisma.$transaction(async (tx) => {
            const ra = await tx.roles.create({
                data: {
                    name: input.data.name
                },
            });

            var rolePermission: { roleId: number, permission: string }[] = [];
            input.data.permissions.forEach((v: string) => {
                rolePermission.push({
                    roleId: ra.id,
                    permission: v
                });
            })
            await tx.rolePermission.createMany({
                data: rolePermission,
            });
        });
        return { result: 0, message: "successful!" };
    } catch (err) {
        return { result: 1, message: "fail!" };
    }
}

export async function update(input: { [key: string]: any; }) {
    const role = await prisma.roles.findFirst({
        where: {
            name: input.data.name,
        },
    })
    if(role && role.id !== input.data.id) {
        return { result: 1, message: "Name already exists" };
    }

    var rolePermission: { roleId: number, permission: string }[] = [];
    input.data.permissions.forEach((v: string) => {
        rolePermission.push({
            roleId: input.data.id,
            permission: v
        });
    })
    try {
        await prisma.$transaction(async (tx) => {
            await tx.rolePermission.deleteMany({
                where: {
                    roleId: input.data.id,
                },
            })

            await tx.rolePermission.createMany({
                data: rolePermission,
            });

            await tx.roles.update({
                where: { id: input.data.id },
                data: { name: input.data.name },
            });
        });
        return { result: 0, message: "successful!" };
    } catch (err) {
        return { result: 1, message: "fail!" };
    }
}

export async function del(input: { [key: string]: any; }) {
    try {
        await prisma.$transaction(async (tx) => {
            await tx.adminRole.deleteMany({
                where: {
                    roleId: input.data.id,
                },
            })

            await tx.rolePermission.deleteMany({
                where: {
                    roleId: input.data.id,
                },
            })

            await tx.roles.delete({
                where: {
                    id: input.data.id,
                },
            })
        });
        return { result: 0, message: "successful!" };
    } catch (err) {
        return { result: 1, message: "fail!" };
    }
}

export async function getRolePermission(input: { [key: string]: any; }) {
    const rolePermission = await prisma.rolePermission.findMany({
        where: {
            roleId: input.data.id,
        },
    })

    var permissions: string[] = [] 
    rolePermission.forEach((v) => {
        permissions.push(v.permission)
    })
    return { result: 0, message: "successful!", data: { permissions: permissions } };
}

export async function getAll(input: { [key: string]: any; }) {
    const list = await prisma.roles.findMany({
        where: {}
    })
    return { result: 0, message: "successful!", data: { list: list } };
}