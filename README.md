# Chirpy Web Service

A simple web service built with TypeScript, Node.js, Express, and PostgreSQL. It mimics some basic functionalities of a social media platform like Twitter.

## Features

-   User registration and login
-   JWT-based authentication with access and refresh tokens
-   CRUD operations for "chirps"
-   Password hashing with Argon2
-   Database migrations using Drizzle ORM
-   Admin endpoints for metrics and data reset
-   Webhook for user upgrades (e.g., to a premium plan)
-   Static file serving for a frontend application

## Technologies

-   **Backend**: Node.js, Express.js
-   **Language**: TypeScript
-   **Database**: PostgreSQL
-   **ORM**: Drizzle ORM
-   **Authentication**: JSON Web Tokens (JWTs), Argon2
-   **Testing**: Vitest

## Getting Started

### Prerequisites

-   Node.js (v21.7.0 or compatible)
-   npm
-   A running PostgreSQL instance

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd ts_webserv
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the project root and add the following variables.

    ```env
    # Set to "dev" for development features like /admin/reset
    PLATFORM="dev" 
    
    # Secret for signing JWTs
    SECRET="your-jwt-secret" 
    
    # API key for Polka webhooks
    POLKA_KEY="your-polka-api-key"
    
    # Connection string for your PostgreSQL database
    DB_URL="postgresql://user:password@localhost:5432/your_db_name"
    ```

4.  **Run the application:**
    The application automatically runs database migrations on startup.

    For development (with auto-rebuild):
    ```bash
    npm run dev
    ```

    For production:
    ```bash
    npm run build
    npm run start
    ```

## Available Scripts

-   `npm run build`: Compiles TypeScript files to JavaScript in the `dist` directory.
-   `npm run start`: Starts the server from the compiled files in `dist`.
-   `npm run dev`: Compiles TypeScript and starts the server in development mode.
-   `npm run generate`: Generates a new database migration based on schema changes.
-   `npm run migrate`: Applies pending database migrations (also runs on startup).
-   `npm run test`: Runs the test suite using Vitest.

## API Endpoints

### Health & Admin

-   `GET /api/healthz`: Health check endpoint. Returns `200 OK`.
-   `GET /admin/metrics`: Displays an HTML page with application metrics (e.g., fileserver hits).
-   `POST /admin/reset`: Resets application metrics and clears the database. Only available when `PLATFORM` is "dev".

### Users & Authentication

-   `POST /api/users`: Register a new user.
-   `PUT /api/users`: Update user's email and password. Requires authentication.
-   `POST /api/login`: Log in a user. Returns an access token and a refresh token.
-   `POST /api/refresh`: Get a new access token using a refresh token.
-   `POST /api/revoke`: Revoke a refresh token.

### Chirps

-   `POST /api/chirps`: Create a new chirp. Requires authentication.
-   `GET /api/chirps`: Get all chirps. Can be filtered by `authorId` and sorted by `sort` (`asc`/`desc`).
-   `GET /api/chirps/:id`: Get a specific chirp by its ID.
-   `DELETE /api/chirps/:id`: Delete a chirp. Requires authentication and ownership of the chirp.

### Webhooks

-   `POST /api/polka/webhooks`: Webhook endpoint for external services (like Polka) to notify of user upgrades.
