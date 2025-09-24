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

export async function handerValidateChirp(req: Request, res: Response): Promise<void> {
    type respBody = {
        valid ?: Boolean,
        error ?: string
    }

    let body = "";
    let statusCode = 200;
    let respBody: respBody = {
            valid: true,
        };
    
    res.header("Content-Type", "application/json");
    
    req.on("data", (chunck) => {
        body += chunck;
    });

    req.on("end", () => {
        try {
            const chirp = JSON.parse(body);
            if (chirp.body.length > 140)
            {
                statusCode = 400;
                respBody = { error: "Chirp is too long" }
            }
        } catch (error) {
            statusCode = 400;
            respBody = { error: "Something went wrong" };
        }
        
   
        res.status(statusCode).send(JSON.stringify(respBody))
    })
}

