import express from "express";
import { middlewareLogResponses } from "./middleware.js";
import { handlerReadiness } from "./handler.js";

const app = express();
const PORT = 8080;

app.use("/app", express.static("./src/app"));

app.use(middlewareLogResponses);


app.get('/healthz', handlerReadiness);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
