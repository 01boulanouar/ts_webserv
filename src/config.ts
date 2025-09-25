import { env, loadEnvFile } from "process"; 

loadEnvFile();

type APIConfig = {
    fileserverHits: number;
    dbUrl: string 
}

function envOrThrow(key: string) {
    if (!env.key)
        throw new Error(`${key} not set in .env`);
    return env.key;
}

export const config: APIConfig = {
    fileserverHits: 0,
    dbUrl: envOrThrow("DB_URL"),
};
