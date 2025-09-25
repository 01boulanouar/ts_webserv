import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";
import { asc } from "drizzle-orm";

export async function createChirps(chirp: NewChirp) {
    const [result] = await db.insert(chirps).values(chirp).onConflictDoNothing().returning();
    return result;
}

export async function deleteChirps() {
    await db.delete(chirps);
}

export async function getChirps() { 
    const result = await db.select().from(chirps).orderBy(asc(chirps.createdAt));
    return result;
}