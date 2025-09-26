import { Request, Response } from "express";
import { BadRequestError, ForbiddenError, NotFoundError } from "../error.js";;
import { createChirps, deleteChirp, getChirp, getChirps } from "../db/queries/chirps.js";
import { getJSON } from "./handler.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";
import { NewChirp } from "src/db/schema.js";

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
   
    let chirps: Chirp[];
    const authorId = req.query.authorId as string || "";
    const sort = req.query.sort as string || "";  

    chirps = await getChirps();
    
    const filtered = chirps.filter((chirp) => chirp.userId === authorId || authorId === "");

    const result = filtered.map((chirp) => renameChirp(chirp));

    if (sort && sort === "desc")
        result.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
    res.json(result);
 
}

export async function handlerChirp(req: Request, res: Response): Promise<void> {
    if (!req.params.id)
        throw new NotFoundError("Chirp Not found");
    const result = await getChirp(req.params.id);
    if (!result)
        throw new NotFoundError("Chirp Not found");
    res.json(renameChirp(result));

}


export async function handlerDeleteChirp(req: Request, res: Response): Promise<void> {
    if (!req.params.id)
        throw new NotFoundError("Chirp Not found");
     
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.api.secret);
    const chirp = await getChirp(req.params.id);
    if (chirp.user_id !== userId)
        throw new ForbiddenError("Not the owner of the chirp");
    
    const result = await deleteChirp(req.params.id);
    res.status(204).json(result);

}
