import { NextResponse } from "next/server";
import { prisma } from "../../lib/PrismaClient";
import { routes } from "@/config/route";
import { getAdmin } from "@/lib/server/global-cache";

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
        return NextResponse.json({ result: 1, message: "Invalid API route." });
    }

    if (input.url !== "login") {
        const cookieHeader = req.headers.get("cookie") || "";
        const token = cookieHeader
            .split("; ")
            .find((c) => c.startsWith("token="))
            ?.split("=")[1];

        if (!token) {
            return NextResponse.json({ result: 2, message: "Not authenticated." });
        }

        const admin = await getAdmin(token);
        if (!admin) {
            return NextResponse.json(
                { result: 2, message: "Token error." },
                {
                    status: 200,
                    headers: {
                        "Set-Cookie": "token=; Path=/; HttpOnly; Max-Age=0"
                    },
                }
            );
        }

        input.admin = admin;
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
        return NextResponse.json({ result: 1, message: "API function not found." });
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
        return NextResponse.json({ result: 1, message: "Invalid API route." });
    }

    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
        .split("; ")
        .find((c) => c.startsWith("token="))
        ?.split("=")[1];

    if (!token) {
        return NextResponse.json({ result: 2, message: "Not authenticated." });
    }

    if (!getAdmin(token)) {
        return NextResponse.json(
            { result: 2, message: "Token error." },
            {
                status: 200,
                headers: {
                    "Set-Cookie": "token=; Path=/; HttpOnly; Max-Age=0"
                },
            }
        );
    }

    const admin = await getAdmin(token);
    if(!admin) {
        return NextResponse.json(
            { result: 2, message: "Token error." },
            {
                status: 200,
                headers: {
                    "Set-Cookie": "token=; Path=/; HttpOnly; Max-Age=0"
                },
            }
        );
    }

    formData.append('adminId', String(admin?.id ?? ""));
    formData.append('adminName', String(admin?.name ?? ""));

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
        return NextResponse.json({ result: 1, message: "API function not found." });
    }
    routeCache[String(formData.get("url"))] = mod[route.fun];
    const res = await (mod as any)[route.fun](formData);
    if (res instanceof NextResponse) {
        return res;
    } else {
        return NextResponse.json(res);
    }
}
