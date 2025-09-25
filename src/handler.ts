import { Request, Response } from "express";
import { config } from "./config.js";
import { error } from "console";

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

function sendJsonError(req: Request, res: Response, error: string): void {
    res.status(400).json({ error });
}

export async function handerValidateChirp(req: Request, res: Response): Promise<void> {

    res.header("Content-Type", "application/json");
    try {
        const chirp: {body: string} = req.body;
        if (chirp.body.length > 140)
        {
            sendJsonError(req, res, "Chirp is too long");
            return;
        }
        res.json({ cleanedBody: cleanBody(chirp.body) });

    } catch (error) {
        sendJsonError(req, res, "Something went wrong" );
        return;
    }
 
}

