import { env, loadEnvFile } from "process"; 
import { MigrationConfig } from "drizzle-orm/migrator";

loadEnvFile();

function envOrThrow(key: string) {
    if (!env[key])
        throw new Error(`${key} not set in .env`);
    return env[key];
}

type APIConfig = {
    api: {
        fileserverHits: number,
        platform: string,
        secret: string,
        accessTokenLimit: number,
    }
    db: {
        url: string,
        migrationConfig: MigrationConfig,
    }
}

const migrationConfig: MigrationConfig = {
    migrationsFolder: "./src/db/migrations",
}

export const config: APIConfig = {
    api: {
        fileserverHits: 0,
        platform: envOrThrow("PLATFORM"),
        secret: envOrThrow("SECRET"),
        accessTokenLimit: 3600,
    },
    db: {
        url: envOrThrow("DB_URL"),
        migrationConfig
    }
};

