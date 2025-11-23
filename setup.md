# Personal Finance Tracker - Setup Instructions

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher) or yarn (v1.22 or higher)
- PostgreSQL (v14 or higher)
- Redis (v6 or higher)

## Clone Repository

```bash
# Clone the repository
git clone <repository-url>
cd Full-Stack-Personal-Finance-Tracker
```

## Database Setup

1. Install PostgreSQL if not already installed:
   - [PostgreSQL Downloads](https://www.postgresql.org/download/)
   - During installation, note your username, password, and port (default is 5432)

2. Create a PostgreSQL database named `finance_tracker`:
   ```sql
   CREATE DATABASE finance_tracker;
   ```
   
3. The server will automatically create the tables on startup when you run the application.

## Redis Setup

1. Install Redis if not already installed:
   - [Redis Downloads](https://redis.io/download) for Linux/Mac
   - For Windows users, you have two options:
     - [Memurai](https://www.memurai.com/) - A Redis-compatible server for Windows (recommended)
     - [Redis for Windows](https://github.com/microsoftarchive/redis/releases) - Older Windows port

2. Start the Redis server:
   - Linux/Mac: `redis-server`
   - Windows with Memurai: Start Memurai service from the Start menu or Services
   - Windows with Redis: Start the Redis server using the executable

## Backend Setup

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Create a `.env` file in the `server` directory with the following content:
   ```
   DB_HOST=localhost
   DB_USER=postgres            # Replace with your PostgreSQL username
   DB_PASSWORD=your_password    # Replace with your PostgreSQL password
   DB_NAME=finance_tracker
   DB_PORT=5432                # Default PostgreSQL port (change if yours is different)
   REDIS_HOST=localhost
   REDIS_PORT=6379
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   NODE_ENV=development
   PORT=5000                   # Backend server port
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the server in development mode:
   ```bash
   npm run dev
   ```
   Or in production mode:
   ```bash
   npm start
   ```

## Frontend Setup

1. Navigate to the `client` directory:
   ```bash
   cd ../client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Access the Application

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:5000](http://localhost:5000)
- API Documentation (Swagger): [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

## Admin User Setup

There are two ways to create an admin user:

### Option 1: Using admin.txt

The project includes an `admin.txt` file with predefined admin user credentials:

```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin"
}
```

You can use these credentials to log in as an admin user after registering with the same email.

### Option 2: Manual Database Update

1. Register a regular user through the application
2. Connect to your PostgreSQL database
3. Update the user role to 'admin':

```sql
UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';
```

## Features Overview

- **Authentication**: JWT-based authentication system
- **Transaction Management**: Create, read, update, and delete financial transactions
- **Analytics**: Visualize spending patterns and financial data using charts
- **Admin Panel**: User management for administrators
- **API Documentation**: Swagger documentation for backend API
- **Rate Limiting**: Protection against excessive API requests
- **Caching**: Redis-based caching for improved performance

## Development Tools

- **Server Restart**: The server uses Node.js watch mode for auto-restart on file changes
- **Frontend Hot Reload**: Vite provides fast hot module replacement
- **API Testing**: Use Swagger UI to test API endpoints at [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running: `pg_isready`
- Check credentials in `.env` file
- Ensure the database `finance_tracker` exists

### Redis Connection Issues

- Verify Redis is running: `redis-cli ping` (should respond with PONG)
- If Redis fails to connect, the application will still work but without caching functionality

### Port Conflicts

- If port 5000 or 5173 is already in use, modify the corresponding port in the configuration:
  - For backend: Change PORT in `.env` file
  - For frontend: Modify the `vite.config.js` file
