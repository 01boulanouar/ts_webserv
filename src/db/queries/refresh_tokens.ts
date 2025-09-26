import { db } from "../index.js";
import { NewRefreshToken, refresh_tokens } from "../schema.js";

export async function createRefreshToken(refresh_token: NewRefreshToken) {
    const [result] = await db.insert(refresh_tokens).values(refresh_token).onConflictDoNothing().returning();
    return result;
}

export async function deleteRefreshTokens() {
    await db.delete(refresh_tokens);
}
