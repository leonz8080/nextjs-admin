import { prisma } from "../../lib/PrismaClient";

interface AdminModel {
  id: Number,
  name: string,
  permissions: string[]
}

declare global {
  // 在 TypeScript 中声明 globalThis 类型
  var adminCache: Map<string, AdminModel>;
}

if (!globalThis.adminCache) {
  globalThis.adminCache = new Map();
}

export const adminCache = globalThis.adminCache;

export async function getAdmin(token: string): Promise<AdminModel | undefined> {
  if (!globalThis.adminCache.get(token)) {
    const admin = await prisma.admin.findFirst({
      where: {
        token: token,
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

    globalThis.adminCache.set(token, {
      id: admin.id,
      name: admin.name,
      permissions: permissions
    });
  }

  return globalThis.adminCache.get(token);
}