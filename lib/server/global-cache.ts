import { prisma } from "../../lib/PrismaClient";

interface AdminModel {
  jti: string,
  tokenHash: string,
  permissions: string[]
}

declare global {
  // 在 TypeScript 中声明 globalThis 类型
  var adminCache: Map<number, AdminModel>;
  var configCache: Map<string, string>;
}

if (!globalThis.adminCache) {
  globalThis.adminCache = new Map();
}

if (!globalThis.configCache) {
  globalThis.configCache = new Map();
}

export const adminCache = globalThis.adminCache;

export async function getAdmin(id: number): Promise<AdminModel | undefined> {
  if (!globalThis.adminCache.get(id)) {
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

    globalThis.adminCache.set(id, {
      jti: admin.jti ?? '',
      tokenHash: admin.tokenHash ?? '',
      permissions: permissions
    });
  }

  return globalThis.adminCache.get(id);
}

export const configCache = globalThis.configCache;

export async function getConfig(name: string): Promise<string> {
  if (!globalThis.configCache.get(name)) {
    console.log("Loading config from database:", name);
    const config = await prisma.config.findMany();
    config.forEach((v) => {
      globalThis.configCache.set(v.name, v.value);
    });
  }

  return globalThis.configCache.get(name) ?? "";
}