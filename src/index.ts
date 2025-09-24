import express from "express";
import { Request, Response } from "express";

const app = express();
const PORT = 8080;

app.use(express.static("."));

async function handlerReadiness(req: Request, res: Response): Promise<void> {
    res.set({
        "Content-Type": "text/plain",
    });
    res.send();

}

app.get('/healthz', handlerReadiness);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
