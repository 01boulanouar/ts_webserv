import { Request, Response } from "express";
import { BadRequestError } from "../error.js";;
import { createUsers } from "../db/queries/users.js";
import { getJSON } from "./handler.js";
import { hashPassword } from "../auth.js";
import { NewUser } from "../db/schema.js";

type UserResponse = Omit<NewUser, "hashed_password">;

export async function handlerAddUser(req: Request, res: Response): Promise<void> {
    const data: {email: string, password: string} = getJSON(req, res);

    if (!data.email)
        throw new BadRequestError("No valid Email provided");
    
    if (!data.password)
        throw new BadRequestError("No valid Password provided");

    const user = await createUsers({ 
        email: data.email,
        hashed_password: await hashPassword(data.password)
    });
    const result: UserResponse = {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }
    res.status(201).json(result);
}
