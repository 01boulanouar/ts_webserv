import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { Request } from "express";
import { UnauthorizedError } from "./error.js";
import { randomBytes } from "crypto";
import { createRefreshToken } from "./db/queries/refresh_tokens.js";
import { NewRefreshToken, NewUser } from "./db/schema.js";

export async function hashPassword(password: string): Promise<string> {
   return await argon2.hash(password);
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, password);
}

export type Payload = Pick<jwt.JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string): string
{

    const payload: Payload = {
        iss: "chirpy",
        sub: userID,
        iat: Math.floor(Date.now() / 1000),
        exp:  Math.floor(Date.now() / 1000) + expiresIn,
    }
    return jwt.sign(payload, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
    const payload = jwt.verify(tokenString, secret)  as Payload;
    return payload.sub!;
}

export function getBearerToken(req: Request): string {
    const authHeader = req.get("Authorization");
    if (!authHeader) 
        throw new UnauthorizedError("No Bearer Token");
    const bearerToken = authHeader.split(" ")[1];
    return bearerToken;
}

export async function makeRefreshToken(user_id: string) {
    const refreshToken: NewRefreshToken = {
        user_id,
        token: randomBytes(32).toString('hex'),
        expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        revoked_at: null,
    };
    const result = await createRefreshToken(refreshToken);
    return result.token;
}