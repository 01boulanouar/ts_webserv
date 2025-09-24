import express from "express";
import { middlewareLogResponses, middlewareMetricsInc } from "./middleware.js";
import { handlerMetrics, handlerReadiness, handlerReset } from "./handler.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/admin/metrics", handlerMetrics);
app.get("/admin/reset", handlerReset);
app.get('/api/healthz', handlerReadiness);


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
