import { Request, Response } from "express";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../error.js";;
import { createChirps, getChirp, getChirps } from "../db/queries/chirps.js";
import { getJSON } from "./handler.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

type Chirp = {
    id: string,
    createdAt: Date,
    updatedAt: Date,
    body: string,
    userId?: string,
    user_id?: string
}

function renameChirp(chirp: Chirp) {
    return {
        id: chirp.id,
        createdAt: chirp.createdAt,
        updatedAt: chirp.updatedAt,
        body: chirp.body,
        userId: chirp.user_id
    }
}

function cleanBody(body: string) {
    const filter = ["kerfuffle", "sharbert", "fornax"];
    if (filter.some(item => body.includes(item)))
    {
        body = body.split(" ").map((word) => {
            if (filter.includes(word.toLowerCase()))
                return "****";
            return word;
        }).join(" ");
    };
    return body;
}


export async function handlerAddChirps(req: Request, res: Response): Promise<void> {
    const data: {body: string} = getJSON(req, res);

    const token = getBearerToken(req);
    const userId = validateJWT(token, config.api.secret);

    if (data.body.length > 140)
        throw new BadRequestError("Chirp is too long. Max length is 140");
    

    const result = await createChirps({
        body: cleanBody(data.body),
        user_id: userId
    });
    res.status(201).json(renameChirp(result));
}


export async function handlerChirps(req: Request, res: Response): Promise<void> {
   
    const chirps = await getChirps();
    const result = chirps.map((chirp) => renameChirp(chirp));
    res.json(result);
 
}

export async function handlerChirp(req: Request, res: Response): Promise<void> {
    if (!req.params.id)
        throw new NotFoundError("Chirp Not found");
     
    const result = await getChirp(req.params.id);
    res.json(renameChirp(result));

}
