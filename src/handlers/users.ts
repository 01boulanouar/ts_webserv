import { Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../error.js";;
import { createUsers, getUserByEmail, updateUser } from "../db/queries/users.js";
import { getJSON } from "./handler.js";
import { checkPasswordHash, getBearerToken, hashPassword, makeJWT, makeRefreshToken, validateJWT } from "../auth.js";
import { NewUser } from "../db/schema.js";
import { config } from "../config.js";
import { getRefreshToken, getUserFromRefreshToken, updateRefreshToken } from "../db/queries/refresh_tokens.js";

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
        token: makeJWT(user.id, config.api.accessTokenLimit, config.api.secret),
        refreshToken: await makeRefreshToken(user.id),
    }
    res.json(result);
}

export async function handlerRefresh(req: Request, res: Response): Promise<void> {

    const bearer = getBearerToken(req);
    const token = await getRefreshToken(bearer);
    if (!token || token.revoked_at || Date.now() > token.expires_at.getTime())
        throw new UnauthorizedError("Invalid or revoked refresh token");

    const user = await getUserFromRefreshToken(token);
    const accessToken = makeJWT(user.id, config.api.accessTokenLimit, config.api.secret)

    res.json({ token: accessToken } );
}

export async function handlerRevoke(req: Request, res: Response): Promise<void> {

    const bearer = getBearerToken(req);
    await updateRefreshToken(bearer);
    
    res.status(204).send();
}


export async function handlerUpdateUser(req: Request, res: Response): Promise<void> {
    const data: {email: string, password: string} = getJSON(req, res);

    const token = getBearerToken(req);
    const userId = validateJWT(token, config.api.secret);

    if (!data.email)
        throw new BadRequestError("No valid Email provided");
    
    if (!data.password)
        throw new BadRequestError("No valid Password provided");

    const hashed_password = await hashPassword(data.password);
    const result: UserResponse = await updateUser(userId, data.email, hashed_password);

    res.json(result);
}
