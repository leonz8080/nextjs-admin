import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export interface JwtPayload {
    adminId: number;
    jti: string;
}

export function generateToken(adminId: number, expiresIn?: number) {
    const jti = uuidv4();
    const payload: JwtPayload = { adminId, jti };

    const options: jwt.SignOptions = expiresIn
        ? { expiresIn }
        : {};

    const token = jwt.sign(payload, SECRET_KEY, options);

    const tokenHash = hashToken(token);
    return { token, jti, tokenHash };
}

export function verifyToken(token: string) {
    try {
        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
        return decoded;
    } catch (err) {
        return null;
    }
}

export function hashToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
}