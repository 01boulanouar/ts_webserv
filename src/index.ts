import express from "express";
import { middlewareLogResponses, middlewareMetricsInc } from "./middleware.js";
import { middlewareError } from "./error.js";
import { handlerAddUser, handerValidateChirp, handlerMetrics, handlerReadiness, handlerReset } from "./handler.js";

const app = express();
const PORT = 8080;

app.use(express.json(), middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset",handlerReset);
app.get('/api/healthz', handlerReadiness);
app.post('/api/validate_chirp', handerValidateChirp);
app.post('/api/users',handlerAddUser);

app.use(middlewareError);


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
