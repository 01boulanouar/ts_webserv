import { db } from "../index.js";
import { NewRefreshToken, refresh_tokens, users } from "../schema.js";
import { eq } from "drizzle-orm"

export async function createRefreshToken(refresh_token: NewRefreshToken) {
    const [result] = await db.insert(refresh_tokens).values(refresh_token).onConflictDoNothing().returning();
    return result;
}

export async function deleteRefreshTokens() {
    await db.delete(refresh_tokens);
}

export async function getRefreshToken(token: string) { 
    const [result] = await db.select().from(refresh_tokens).where(eq(refresh_tokens.token, token));
    return result;
}

export async function getUserFromRefreshToken(refresh_token: NewRefreshToken) { 
    const [result] = await db.select().from(refresh_tokens)
    .innerJoin(users, eq(refresh_tokens.user_id, users.id))
    .where(eq(refresh_tokens.token, refresh_token.token));
    return result.users;
}