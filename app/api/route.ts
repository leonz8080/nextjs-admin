import { NextResponse } from "next/server";
import { prisma } from "../../lib/PrismaClient";
import { routes } from "@/config/route";
import { getAdmin, getConfig } from "@/lib/server/global-cache";
import { verifyToken, hashToken } from "@/lib/server/jwt";

var routeCache: { [key: string]: any; } = {};

export async function POST(req: Request) {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
        return formDataRequest(req);
    }

    if (contentType.includes("application/json")) {
        return jsonRequest(req);
    }
}

async function jsonRequest(req: Request) {
    var input = await req.json();

    const route = routes.get(input.url);
    if (!route) {
        return NextResponse.json({ result: 1, message: "invalid-API" });
    }

    if (input.url !== "getDefaultLanguage") {
        if (!(await checkIp(req))) {
            return NextResponse.json(
                { result: 403, message: "Access Denied" },
                {
                    status: 200,
                    headers: {
                        "Set-Cookie": "token=; Path=/; HttpOnly; Max-Age=0"
                    },
                }
            );
        }
    }

    if (input.url !== "login" && input.url !== "getDefaultLanguage") {
        const cookieHeader = req.headers.get("cookie") || "";
        const token = cookieHeader
            .split("; ")
            .find((c) => c.startsWith("token="))
            ?.split("=")[1];

        if (!token) {
            return NextResponse.json({ result: 2, message: "not-auth" });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                { result: 2, message: "token-error" },
                {
                    status: 200,
                    headers: {
                        "Set-Cookie": "token=; Path=/; HttpOnly; Max-Age=0"
                    },
                }
            );
        }

        const tokenHash = hashToken(token);
        const admin = await getAdmin(decoded.adminId);
        if (!admin || admin.jti !== decoded.jti || admin.tokenHash !== tokenHash) {
            return NextResponse.json(
                { result: 2, message: "token-error" },
                {
                    status: 200,
                    headers: {
                        "Set-Cookie": "token=; Path=/; HttpOnly; Max-Age=0"
                    },
                }
            );
        }

        if (decoded.adminId !== 1) {
            if (route.permissions && !route.permissions?.some(item => admin.permissions.includes(item))) {
                return NextResponse.json({ result: 403, message: "request-permission" });
            }
            input.permissions = admin.permissions;
        } else {
            input.permissions = ["admin"];
        }

        input.adminId = decoded.adminId;
    }

    if (input.url in routeCache) {
        const res = await routeCache[input.url](input);
        if (res instanceof NextResponse) {
            return res;
        } else {
            return NextResponse.json(res);
        }
    }

    const mod = await route.ts();
    if (!mod || !(route.fun in mod)) {
        return NextResponse.json({ result: 1, message: "API-not-found" });
    }
    routeCache[input.url] = mod[route.fun];
    const res = await (mod as any)[route.fun](input);
    if (res instanceof NextResponse) {
        return res;
    } else {
        return NextResponse.json(res);
    }
}

async function formDataRequest(req: Request) {
    var formData = await req.formData();

    const route = routes.get(formData.get("url") as string);
    if (!route) {
        return NextResponse.json({ result: 1, message: "invalid-API" });
    }

    if (formData.get("url") !== "getDefaultLanguage") {
        if (!(await checkIp(req))) {
            return NextResponse.json(
                { result: 403, message: "Access Denied" },
                {
                    status: 200,
                    headers: {
                        "Set-Cookie": "token=; Path=/; HttpOnly; Max-Age=0"
                    },
                }
            );
        }
    }

    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
        .split("; ")
        .find((c) => c.startsWith("token="))
        ?.split("=")[1];

    if (!token) {
        return NextResponse.json({ result: 2, message: "not-auth" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return NextResponse.json(
            { result: 2, message: "token-error" },
            {
                status: 200,
                headers: {
                    "Set-Cookie": "token=; Path=/; HttpOnly; Max-Age=0"
                },
            }
        );
    }

    const tokenHash = hashToken(token);
    const admin = await getAdmin(decoded.adminId);

    if (!admin || admin.jti !== decoded.jti || admin.tokenHash !== tokenHash) {
        return NextResponse.json(
            { result: 2, message: "token-error" },
            {
                status: 200,
                headers: {
                    "Set-Cookie": "token=; Path=/; HttpOnly; Max-Age=0"
                },
            }
        );
    }

    if (decoded.adminId !== 1) {
        if (route.permissions && !route.permissions?.some(item => admin.permissions.includes(item))) {
            return NextResponse.json({ result: 403, message: "request-permission" });
        }
        formData.append('permissions', JSON.stringify(admin.permissions));
    } else {
        formData.append('permissions', JSON.stringify(["admin"]));
    }

    formData.append('adminId', String(decoded.adminId));

    if (String(formData.get("url")) in routeCache) {
        const res = await routeCache[String(formData.get("url"))](formData);
        if (res instanceof NextResponse) {
            return res;
        } else {
            return NextResponse.json(res);
        }
    }

    const mod = await route.ts();
    if (!mod || !(route.fun in mod)) {
        return NextResponse.json({ result: 1, message: "API-not-found" });
    }
    routeCache[String(formData.get("url"))] = mod[route.fun];
    const res = await (mod as any)[route.fun](formData);
    if (res instanceof NextResponse) {
        return res;
    } else {
        return NextResponse.json(res);
    }
}

async function checkIp(req: Request) {
    const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0] ||
        req.headers.get("x-real-ip") ||
        "Unknown IP";

    var ipWhitelist = (await getConfig("ipWhitelist"));
    ipWhitelist = ipWhitelist.replace(/\s+/g, '');
    if (ipWhitelist.length !== 0 && !ipWhitelist.split(",").includes(ip)) {
        return false
    }
    return true
}
