import { prisma } from "../../lib/PrismaClient";
import { Prisma } from "@prisma/client";

import { querys } from "@/config/easy-query";

type AnyRow = Record<string, any>;

export async function query(input: { [key: string]: any; }) {
    const qs = input.data.querys
    var result: any = {};

    for (const q of qs) {
        const queryModel = querys.get(q.name);
        if (!queryModel) {
            result[q.name] = { result: 1, message: "query-not-found" };
            continue;
        }

        if (queryModel.permissions && input.permissions) {
            if (!queryModel.permissions?.some(item => input.permissions.includes(item))) {
                result[q.name] = { result: 1, message: "query-permission" };
                continue;
            }
        }

        const sql = buildSqlTemplate(queryModel.source, q.params || {});
        debugSql(sql);

        try {
            const data = await prisma.$queryRaw<AnyRow[]>(sql);;
            if (queryModel.type === "table") {
                result[q.name] = { result: 0, data: data };
            }
            if (queryModel.type === "row") {
                result[q.name] = { result: 0, data: data[0] || null };
            }
            if (queryModel.type === "value") {
                result[q.name] = { result: 0, data: data[0] ? Object.values(data[0])[0] : null };
            }
        } catch (e) {
            console.error(e);
            result[q.name] = { result: 1, message: "query-error" };
        }
    }
    return { result: 0, message: "successful", data: result };
}

export function buildSqlTemplate(
    template: string,
    params: Record<string, any> = {}
): Prisma.Sql {
    const regex = /\$\{(\w+)\}/g;
    const parts: (string | Prisma.Sql)[] = [];

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(template))) {
        const [, paramName] = match;
        const before = template.slice(lastIndex, match.index);
        if (before) parts.push(before);

        const value = params[paramName];
        if (value === undefined) {
            throw new Error(`Missing SQL param: ${paramName}`);
        }

        if (Array.isArray(value)) {
            parts.push(Prisma.sql`(${Prisma.join(value.map(v => Prisma.sql`${v}`))})`);
        } else {
            parts.push(Prisma.sql`${value}`);
        }

        lastIndex = regex.lastIndex;
    }

    if (lastIndex < template.length) {
        parts.push(template.slice(lastIndex));
    }

    let result: Prisma.Sql = Prisma.sql``;
    for (const p of parts) {
        if (typeof p === "string") {
            result = Prisma.sql`${result}${Prisma.raw(p)}`;
        } else {
            result = Prisma.sql`${result}${p}`;
        }
    }

    return result;
}

function debugSql(sql: Prisma.Sql) {
    let query = '';
    for (let i = 0; i < sql.strings.length; i++) {
        query += sql.strings[i];
        if (i < sql.values.length) {
            query += JSON.stringify(sql.values[i]);
        }
    }
    console.log(query);
}