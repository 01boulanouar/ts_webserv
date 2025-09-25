import { Request, Response } from "express";
import { config } from "../config.js";
import { BadRequestError, ForbiddenError }  from "../error.js";;
import {  deleteUsers } from "../db/queries/users.js";
import {  deleteChirps } from "../db/queries/chirps.js";

export function getJSON(req: Request, res: Response) {
    res.header("Content-Type", "application/json");

    if (!req.body)
         throw new BadRequestError("No valid JSON provided");
    return req.body;
}


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
