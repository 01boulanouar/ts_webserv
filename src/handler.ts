import { Request, Response } from "express";
import { config } from "./config.js";

export async function handlerReadiness(req: Request, res: Response): Promise<void> {
    res.set({
        "Content-Type": "text/plain",
    });
    res.send();

}

export async function handlerMetrics(req: Request, res: Response): Promise<void> {

    res.send(`Hits: ${config.fileserverHits}`);

}

export async function handlerReset(req: Request, res: Response): Promise<void> {
    config.fileserverHits = 0;
    res.send();
}
