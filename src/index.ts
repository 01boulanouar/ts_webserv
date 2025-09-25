import express from "express";
import { middlewareLogResponses, middlewareMetricsInc } from "./middleware.js";
import { middlewareError } from "./error.js";
import { handlerAddUser, handlerAddChirps, handlerMetrics, handlerReadiness, handlerReset, handlerChirps } from "./handler.js";

const app = express();
const PORT = 8080;

app.use(express.json(), middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset",handlerReset);
app.get('/api/healthz', handlerReadiness);
app.post('/api/users',handlerAddUser);
app.get('/api/chirps',handlerChirps);
app.post('/api/chirps',handlerAddChirps);

app.use(middlewareError);


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
