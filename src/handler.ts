import { Request, Response } from "express";
import { config } from "./config.js";
import { BadRequestError, ForbiddenError } from "./error.js";;
import { createUsers, deleteUsers } from "./db/queries/users.js";

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


export async function handerValidateChirp(req: Request, res: Response): Promise<void> {
    res.header("Content-Type", "application/json");

    const chirp: {body: string} = req.body;

    if (chirp.body.length > 140)
        throw new BadRequestError("Chirp is too long. Max length is 140");

    res.json({ cleanedBody: cleanBody(chirp.body) });
 
}

export async function handlerAddUser(req: Request, res: Response): Promise<void> {
    res.header("Content-Type", "application/json");
    
    if (!req.body)
         throw new BadRequestError("No valid JSON provided");
    if (!req.body.email)
        throw new BadRequestError("No valid Email provided");
    
    const result = await createUsers({ email: req.body.email });
    res.status(201).json(result);
}