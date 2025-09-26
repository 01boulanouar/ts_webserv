import express from "express";
import { middlewareLogResponses, middlewareMetricsInc } from "./middleware.js";
import { middlewareError } from "./error.js";
import { handlerUpgradeUser, handlerRevoke, handlerRefresh, handlerAddUser, handlerLogin, handlerUpdateUser } from "./handlers/users.js";
import { handlerDeleteChirp, handlerAddChirps, handlerChirps, handlerChirp } from "./handlers/chirps.js";
import { handlerMetrics, handlerReset, handlerReadiness } from "./handlers/handler.js";

const app = express();
const PORT = 8080;

app.use(express.json(), middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset",handlerReset);

app.get('/api/healthz', handlerReadiness);

app.post('/api/users',handlerAddUser);
app.put('/api/users',handlerUpdateUser);

app.post('/api/polka/webhooks',handlerUpgradeUser);

app.post('/api/login',handlerLogin);
app.post('/api/refresh',handlerRefresh);
app.post('/api/revoke',handlerRevoke);


app.post('/api/chirps',handlerAddChirps);
app.get('/api/chirps',handlerChirps);
app.get('/api/chirps/:id',handlerChirp);
app.delete('/api/chirps/:id',handlerDeleteChirp);




app.use(middlewareError);


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
