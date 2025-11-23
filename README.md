# Personal Finance Tracker

![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)

A comprehensive full-stack application for tracking and managing personal finances. This application helps users monitor their financial activities, analyze spending patterns, and make informed financial decisions.

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Screenshots](#screenshots)
- [Setup Instructions](#setup-instructions)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Security Features](#security-features)
- [Performance Optimizations](#performance-optimizations)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Features
- **User Authentication**: Secure registration and login with JWT
- **Transaction Management**: Add, edit, delete, and categorize financial transactions
- **Dashboard**: Overview of financial status with key metrics
- **Analytics**: Visualize spending patterns with interactive charts
- **Profile Management**: Update personal information and preferences

### Advanced Features
- **Role-based Access Control**: Different permissions for admin, regular users
- **Admin Panel**: User management and system monitoring
- **Data Export**: Download transaction data in various formats
- **Search & Filtering**: Find specific transactions quickly

### Technical Features
- **API Rate Limiting**: Protection against excessive requests
- **Redis Caching**: Performance optimization for analytics
- **Responsive Design**: Works on desktop and mobile devices
- **Virtual Scrolling**: Efficient rendering of large transaction lists
- **Swagger Documentation**: Interactive API documentation

## Technology Stack

### Frontend
- **Framework**: React 19 with Vite
- **Routing**: React Router v7
- **State Management**: Context API
- **UI Components**: Custom components with CSS
- **Charts**: Recharts for data visualization
- **Performance**: React Window for virtual scrolling

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Security**: helmet, cors, xss protection

### Database & Caching
- **Database**: PostgreSQL with Sequelize ORM
- **Caching**: Redis (with Memurai support on Windows)

## Setup Instructions

Detailed setup instructions are available in [setup.md](./setup.md)

### Quick Start

1. **Prerequisites**:
   - Node.js (v18 or higher)
   - PostgreSQL (v14 or higher)
   - Redis or Memurai (for Windows)

2. **Backend Setup**:
   ```bash
   cd server
   npm install
   # Configure .env file
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Access**:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
   - API Docs: http://localhost:5000/api/docs

## Project Structure

```
├── client/                 # Frontend React application
│   ├── public/             # Static assets
│   └── src/                # React source code
│       ├── components/     # Reusable UI components
│       ├── context/        # React context providers
│       ├── pages/          # Page components
│       └── assets/         # Images, styles, etc.
│
└── server/                 # Backend Node.js application
    ├── src/                # Server source code
    │   ├── config/         # Configuration files
    │   ├── controllers/    # Request handlers
    │   ├── middleware/     # Express middleware
    │   ├── models/         # Database models
    │   ├── routes/         # API routes
    │   └── utils/          # Utility functions
    └── index.js            # Server entry point
```

## API Documentation

The API is fully documented using Swagger. Once the server is running, you can access the interactive documentation at:

```
http://localhost:5000/api/docs
```

Key API endpoints include:
- `/api/auth` - Authentication routes
- `/api/transactions` - Transaction management
- `/api/analytics` - Financial analytics
- `/api/users` - User management
- `/admin` - Admin operations

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **XSS Protection**: Sanitization of user inputs
- **Rate Limiting**: Protection against brute force attacks
- **Helmet**: HTTP header security
- **CORS**: Configured for secure cross-origin requests

## Performance Optimizations

- **Redis Caching**: Frequently accessed analytics data is cached
- **Virtual Scrolling**: Efficient rendering of large transaction lists
- **Sequelize Optimization**: Efficient database queries
- **Frontend Optimizations**: Code splitting and lazy loading

## License

This project is licensed under the MIT License - see the LICENSE file for details.
