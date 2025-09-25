import { Request, Response } from "express";
import { config } from "./config.js";
import { BadRequestError, ForbiddenError } from "./error.js";;
import { createUsers, deleteUsers } from "./db/queries/users.js";
import { createChirps, deleteChirps, getChirps } from "./db/queries/chirps.js";
import { NewChirp } from "./db/schema.js";

export async function handlerReadiness(req: Request, res: Response): Promise<void> {
    res.set({
        "Content-Type": "text/plain; charset=utf-8",
    });
    res.status(200).send("OK");

}

export async function handlerMetrics(req: Request, res: Response): Promise<void> {
    res.set({
        "Content-Type": "text/html; charset=utf-8"
    });

    res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
  </body>
</html>`);

}

export async function handlerReset(req: Request, res: Response): Promise<void> {
    config.api.fileserverHits = 0;
    if (config.api.platform != "dev")
        throw new ForbiddenError("not enough privileges");
    await deleteChirps();
    await deleteUsers();
    res.send("Reset the metrics");
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

function getJSON(req: Request, res: Response) {
    res.header("Content-Type", "application/json");

    if (!req.body)
         throw new BadRequestError("No valid JSON provided");
    return req.body;
}

export async function handlerAddChirps(req: Request, res: Response): Promise<void> {
    const data: {body: string, userId: string} = getJSON(req, res);

    if (!data.userId)
        throw new BadRequestError("Chirp has no user");
    
    if (data.body.length > 140)
        throw new BadRequestError("Chirp is too long. Max length is 140");
    
    const result = await createChirps({
        body: data.body,
        user_id: data.userId
    });
    res.status(201).json({
        id: result.id,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        body: result.body,
        userId: result.user_id
    });
}


export async function handlerChirps(req: Request, res: Response): Promise<void> {
   
    const chirps = await getChirps();
    const result = chirps.map((chirp) => {
        const renamed = {
        id: chirp.id,
        createdAt: chirp.createdAt,
        updatedAt: chirp.updatedAt,
        body: chirp.body,
        userId: chirp.user_id
    }
        return renamed;
    });
    res.json(result);
 
}


export async function handlerAddUser(req: Request, res: Response): Promise<void> {
    const data: {email: string} = getJSON(req, res);

    if (!data.email)
        throw new BadRequestError("No valid Email provided");
    
    const result = await createUsers({ email: data.email });
    res.status(201).json(result);
}