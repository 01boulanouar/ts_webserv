import { Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../error.js";;
import { createUsers, getUserByEmail } from "../db/queries/users.js";
import { getJSON } from "./handler.js";
import { checkPasswordHash, hashPassword, makeJWT, makeRefreshToken } from "../auth.js";
import { NewUser } from "../db/schema.js";
import { config } from "../config.js";

type UserResponse = Omit<NewUser, "hashed_password"> & { token?: string, refreshToken?: string };

export async function handlerAddUser(req: Request, res: Response): Promise<void> {
    const data: {email: string, password: string} = getJSON(req, res);

    if (!data.email)
        throw new BadRequestError("No valid Email provided");
    
    if (!data.password)
        throw new BadRequestError("No valid Password provided");

    const hashed_password = await hashPassword(data.password);
    const user = await createUsers({ 
        email: data.email,
        hashed_password
    });

    const result: UserResponse = {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }
    res.status(201).json(result);
}


export async function handlerLogin(req: Request, res: Response): Promise<void> {
    const data: {email: string, password: string } = getJSON(req, res);

    if (!data.email)
        throw new BadRequestError("No valid Email provided");
    
    if (!data.password)
        throw new BadRequestError("No valid Password provided");

    const user = await getUserByEmail(data.email);
    if (!user)
        throw new UnauthorizedError("Incorrect email or password");

    const valid = await checkPasswordHash(data.password, user.hashed_password);
    if (!valid)
        throw new UnauthorizedError("Incorrect email or password");
    
    const result: UserResponse = {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        token: makeJWT(user.id, 3600, config.api.secret),
        refreshToken: await makeRefreshToken(user.id),
    }
    res.json(result);
}
