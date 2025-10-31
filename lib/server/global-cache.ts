import { prisma } from "../../lib/PrismaClient";
import NodeCache from 'node-cache';

interface AdminModel {
  jti: string,
  tokenHash: string,
  permissions: string[]
}

export const adminCache = new NodeCache();
export const configCache = new NodeCache();

export async function getAdmin(id: number): Promise<AdminModel | undefined> {
  if (!adminCache.get(id)) {
    const admin = await prisma.admin.findFirst({
      where: {
        id: id,
      },
    })
    if (!admin) {
      return undefined;
    }

    const result = await prisma.$queryRaw<{ permission: string }[]>`SELECT distinct b.permission FROM AdminRole a, RolePermission b WHERE a.adminId = ${admin.id} and a.roleId = b.roleId`;
    let permissions: string[] = [];
    result.forEach((v) => {
      permissions.push(v.permission);
    });

    adminCache.set(id, {
      jti: admin.jti ?? '',
      tokenHash: admin.tokenHash ?? '',
      permissions: permissions
    });
  }

  return adminCache.get(id);
}


export async function getConfig(name: string): Promise<string> {
  if (!configCache.get(name)) {
    const config = await prisma.config.findMany();
    config.forEach((v) => {
      configCache.set(v.name, v.value);
    });
  }

  return configCache.get(name) ?? "";
}