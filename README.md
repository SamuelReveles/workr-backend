# Express Application

This is an Express.js application using TypeScript for server-side development.

## Getting Started

### Prerequisites
- Node.js and npm installed
- TypeScript installed globally (`npm install -g typescript`)

### Installation
1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Request the `.env` file and place it in the root directory.

### Running the Application

1. Compile TypeScript to JavaScript using:
    ```bash
    tsc --watch
    ```
    Alternatively, you can run:
    ```bash
    npm run watch
    ```

2. Start the server:
    ```bash
    npm start
    ```

The server should now be running at `http://localhost:3000` by default.

## Project Structure

- **controllers/**: Contains functions that handle the application's business logic.
- **routes/**: Contains Express routers that manage API endpoints.
- **models/**:
  - Database models and schemas for SQL tables.
  - The Express server is also located here.

## Database Management

This application uses SQL for database operations. To execute SQL queries, use the `executeQuery` function available in the project. Ensure proper SQL syntax and manage transactions where necessary.

## Additional Notes
- Ensure the `.env` file has all the required environment variables set up.
- Logs and error handling are available for better debugging.
