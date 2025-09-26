import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { eq } from "drizzle-orm"

export async function createUsers(user: NewUser) {

    const [result] = await db.insert(users).values(user).returning();
    return result;
}


export async function getUserByEmail(email: string) {
    const [result] = await db.select().from(users).where(eq(users.email, email));
    return result;
}


export async function deleteUsers() {
    await db.delete(users);
}

export async function updateUser(id: string, email: string, hashed_password: string) { 
    const [result] = await db.update(users).set({ 
         id,
         email,
         hashed_password
        })
    .where(eq(users.id, id)).returning();
    return result;
}


export async function upgradeUser(id: string) { 
    const [result] = await db.update(users).set({ 
            is_chirpy_red: true
        })
    .where(eq(users.id, id)).returning();
    return result;
}