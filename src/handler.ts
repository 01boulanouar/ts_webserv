import { Request, Response } from "express";
import { config } from "./config.js";
import { BadRequestError } from "./error.js";

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
    <p>Chirpy has been visited ${config.fileserverHits} times!</p>
  </body>
</html>`);

}

export async function handlerReset(req: Request, res: Response): Promise<void> {
    config.fileserverHits = 0;
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

