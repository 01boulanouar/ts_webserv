import express from "express";
import { middlewareLogResponses, middlewareMetricsInc } from "./middleware.js";
import { middlewareError } from "./error.js";
import { handlerRefresh, handlerAddUser, handlerLogin } from "./handlers/users.js";
import { handlerAddChirps, handlerChirps, handlerChirp } from "./handlers/chirps.js";
import { handlerMetrics, handlerReset, handlerReadiness } from "./handlers/handler.js";

const app = express();
const PORT = 8080;

app.use(express.json(), middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset",handlerReset);

app.get('/api/healthz', handlerReadiness);

app.post('/api/users',handlerAddUser);
app.post('/api/login',handlerLogin);

app.post('/api/chirps',handlerAddChirps);
app.get('/api/chirps',handlerChirps);
app.get('/api/chirps/:id',handlerChirp);

app.post('/api/refresh',handlerRefresh);

app.use(middlewareError);


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
